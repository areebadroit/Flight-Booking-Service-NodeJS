const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { StatusCodes } = require("http-status-codes");
function getInfo(req, res) {
  try {
    SuccessResponse.message = "Information retrieved successfully.";
    SuccessResponse.data = {
      explanation: "Booking service Api is running and works fine.",
    };
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.log(error);
    ErrorResponse.message = "Something went wrong while getting the info";
    ErrorResponse.error = error;
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(ErrorResponse);
  }
}
module.exports = {
  getInfo,
};
