const CrudRepository = require("./crud-repositories");
const { Booking } = require("../models");
const { BOOKING_STATUS } = require("../utils/common/enums");
const { CANCELLED, BOOKED } = BOOKING_STATUS;
const { Op } = require("sequelize");
class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }
  async createBooking(data, transaction) {
    const response = await Booking.create(data, { transaction: transaction });
    return response;
  }
  //overriding crud repository functions
  async get(data, transaction) {
    const response = await Booking.findByPk(data, {
      transaction: transaction,
    });
    return response;
  }
  async update(id, data, transaction) {
    const response = await this.model.update(
      data,
      {
        where: {
          id: id,
        },
      },
      { transaction: transaction }
    );
    return response;
  }
  async cancelDummyBookings(timestamp) {
    const response = await Booking.update(
      { status: CANCELLED },
      {
        where: {
          [Op.and]: [
            {
              createdAt: {
                [Op.lt]: timestamp,
              },
            },
            {
              status: {
                [Op.ne]: BOOKED,
              },
            },
            {
              status: {
                [Op.ne]: CANCELLED,
              },
            },
          ],
        },
      }
    );
    return response;
  }
}

module.exports = BookingRepository;
