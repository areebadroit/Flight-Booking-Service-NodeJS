const { StatusCodes } = require("http-status-codes");
const { BookingRepository } = require("../repositories");
const { AppError } = require("../utils/errors/app-error");
const db = require("../models");
const axios = require("axios");
const { ServerConfig } = require("../config");
const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const result = await db.sequelize.transaction(async (t) => {
      const flight = await axios.get(
        `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
      );
      const flightData = flight.data.data;
      if (parseInt(data.noofSeats) > flightData.totalSeats) {
        console.log("here");
        throw new AppError(
          "Not enough seats available",
          StatusCodes.BAD_REQUEST
        );
      }
      const totalBillingAmount = data.noOfSeats * flightData.price;
      const bookingPayload = { ...data, totalCost: totalBillingAmount };
      const booking = await bookingRepository.createBooking(
        bookingPayload,
        transaction
      );
      const response = axios.patch(
        `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`,
        {
          seats: data.noOfSeats,
        }
      );
      await transaction.commit();
      return booking;
    });

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
async function destroyBooking(id) {
  try {
    const response = await bookingRepository.destroy(id);
    return response;
  } catch (error) {
    throw new AppError(
      "Error occured in deleting a booking with the given id",
      error.statusCode
    );
  }
}
async function updateBooking(id, data) {
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
module.exports = {
  createBooking,
  getBookings,
  getBooking,
  destroyBooking,
  updateBooking,
};
