const CrudRepository = require("./crud-repositories");
const { Booking } = require("../models");

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
}

module.exports = BookingRepository;
