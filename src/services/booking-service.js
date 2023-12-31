const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const { AppError } = require("../utils/errors/app-error");
const db = require("../models");
const axios = require("axios");
const { ServerConfig } = require("../config");
const { BOOKING_STATUS } = require("../utils/common/enums");
const { BOOKED, INITIATED, CANCELLED, PENDING } = BOOKING_STATUS;
const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );
    const flightData = flight.data.data;
    if (parseInt(data.noofSeats) > flightData.totalSeats) {
      console.log("here");
      throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
    }
    const totalBillingAmount = data.noOfSeats * flightData.price;
    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );
    const response = await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`,
      {
        seats: data.noOfSeats,
      }
    );
    await transaction.commit();
    return booking;

    // If the execution reaches this line, the transaction has been committed successfully
    // `result` is whatever was returned from the transaction callback (the `user`, in this case)
  } catch (error) {
    // If the execution reaches this line, an error occurred.
    // The transaction has already been rolled back automatically by Sequelize!
    console.log(error);
    if (error.name == "SequelizeValidationError") {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      console.log(explanation);
      throw new AppError(explanation, StatusCodes.INTERNAL_SERVER_ERROR);
    }
    await transaction.rollback();
    throw new AppError(
      "Error occured in Creation of Booking",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
//Managed Transaction
// async function createBooking(data) {
//   try {
//     const result = await db.sequelize.transaction(async (t) => {
//       const flight = await axios.get(
//         `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
//       );
//       if (parseInt(data.noofSeats) > flight.data.data.totalSeats) {
//         console.log("here");
//         throw new AppError(
//           "Not enough seats available",
//           StatusCodes.BAD_REQUEST
//         );
//       }
//       return true;
//     });

//     // If the execution reaches this line, the transaction has been committed successfully
//     // `result` is whatever was returned from the transaction callback (the `user`, in this case)
//   } catch (error) {
//     // If the execution reaches this line, an error occurred.
//     // The transaction has already been rolled back automatically by Sequelize!
//     console.log(error);
//     throw error;
//   }
// }
async function getBookings() {
  try {
    const allBooking = await bookingRepository.getAll();
    return allBooking;
  } catch (error) {
    throw new AppError(
      "Error occured in all retrieving all bookings",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
async function getBooking(id) {
  try {
    const booking = await bookingRepository.get(id);
    return booking;
  } catch (error) {
    throw new AppError(
      "Error occured in retrieving an booking with the given id",
      error.statusCode
    );
  }
}
async function cancelBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(
      data.bookingId,
      transaction
    );
    console.log(bookingDetails);
    if (bookingDetails.status == CANCELLED) {
      await transaction.commit();
      return true;
    }
    await axios.patch(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${bookingDetails.flightId}`,
      {
        seats: bookingDetails.noOfSeats,
        dec: 0,
      }
    );
    await bookingRepository.update(
      data.bookingId,
      { status: CANCELLED },
      transaction
    );
    await transaction.commit();
    return true;
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw new AppError(
      "Error occured in cancelling a booking with the given id",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}
//Basically cancel the booking past 10 minutes for which payment ha snot been completed and unreserve the seat
async function cancelDummyBookings() {
  try {
    const time = new Date(Date.now() - 1000 * 900); // time 15 mins ago
    const response = await bookingRepository.cancelDummyBookings(time);
    return response;
  } catch (error) {
    console.log(error);
  }
}
async function updateBooking(id, data) {
  const transaction = db.sequelize.transaction();
  try {
    const booking = await bookingRepository.update(id, data);
    console.log(booking);
    return booking;
  } catch (error) {
    throw new AppError(
      "Booking with the given id does not exists.",
      error.statusCode
    );
  }
}
async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.get(
      data.bookingId,
      transaction
    );
    if (bookingDetails.status == CANCELLED) {
      throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
    }
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();
    if (currentTime - bookingTime > 300000) {
      await bookingRepository.update(data.bookingId, { status: CANCELLED });
      throw new AppError("The booking has expired", StatusCodes.BAD_REQUEST);
    }
    if (bookingDetails.totalCost !== data.totalCost) {
      throw new AppError(
        "The amount of the payment doesn't match",
        StatusCodes.BAD_REQUEST
      );
    }
    if (bookingDetails.userId !== data.userId) {
      throw new AppError(
        "The user corresponding to the booking doesn't match",
        StatusCodes.BAD_REQUEST
      );
    }
    const response = await bookingRepository.update(
      data.bookingId,
      { status: BOOKED },
      { transaction: transaction }
    );
    await transaction.commit();
  } catch (error) {
    console.log(error);
    await transaction.rollback();
    throw error;
  }
}
module.exports = {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  updateBooking,
  makePayment,
  cancelDummyBookings,
};
