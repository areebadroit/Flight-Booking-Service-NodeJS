const cron = require("node-cron");
const { BookingService } = require("../../services");
function scheduleCrons() {
  cron.schedule("*/30 * * * *", () => {
    //run at 30 minutes interval
    BookingService.cancelDummyBookings();
  });
}

module.exports = scheduleCrons;
