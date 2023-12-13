const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
async function createBooking(req, res) {
  console.log(req.body);
  try {
    const booking = await BookingService.createBooking({
      flightId: req.body.flightId,
      userId: req.body.userId,
      noOfSeats: req.body.noofSeats,
    });
    console.log(booking);
    SuccessResponse.message = "Successfully created an booking";
    SuccessResponse.data = booking;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.message = "Something went wrong while creating an booking";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function makePayment(req, res) {
  try {
    const payment = await BookingService.makePayment({
      userId: req.body.userId,
      bookingId: req.body.bookingId,
      totalCost: req.body.totalCost,
    });
    SuccessResponse.message = "Successfully made a payment";
    SuccessResponse.data = payment;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.message = "Something went wrong while making a payment";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function getBookings(req, res) {
  try {
    const allBooking = await BookingService.getBookings();
    SuccessResponse.message = "Listing all bookings";
    SuccessResponse.data = allBooking;
    SuccessResponse.success = true;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message =
      "Something went wrong while retrieving all bookings";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function getBooking(req, res) {
  try {
    const booking = await BookingService.getBooking(req.params.id);
    SuccessResponse.message = "Listing all bookings";
    SuccessResponse.data = booking;
    SuccessResponse.success = true;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message =
      "Something went wrong while retrieving booking with the given id";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
async function cancelBooking(req, res) {
  try {
    const response = await BookingService.cancelBooking(req.body);
    SuccessResponse.message = `Booking with id ${req.body.bookingId} cancelled.`;
    SuccessResponse.data = response;
    SuccessResponse.success = true;
    return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.message =
      "Something went wrong while cancelling booking with the given id";
    ErrorResponse.error = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}
async function updateBooking(req, res) {
  try {
    const response = await BookingService.updateBooking(
      req.params.id,
      req.body
    );
    SuccessResponse.message = `Booking with id ${req.params.id} updated.`;
    SuccessResponse.data = response;
    SuccessResponse.success = true;
    return res.status(StatusCodes.ACCEPTED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.message =
      "Something went wrong while updating booking with the given id";
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}
module.exports = {
  createBooking,
  makePayment,
  getBookings,
  getBooking,
  cancelBooking,
  updateBooking,
};
