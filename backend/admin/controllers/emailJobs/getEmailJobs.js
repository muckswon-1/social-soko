const { Op } = require("sequelize");
const {EmailJob} = require("../../../models");
const UTILS = require("../../../utils/utils");


module.exports = UTILS.catchAsync(async (req, res) => {

  //const { page = 1, limit = 10 } = req.query;
const {
  status: rawStatus = "all",
  page: rawPage = "1",
  limit: rawLimit = "50"

} = req.query;


const page = Math.max(parseInt(rawPage, 10) || 1, 1);
const limit = Math.max(Math.min(parseInt(rawLimit,10) || 50, 200),1);
const offset = (page - 1) * limit;

const where = {};

if(rawStatus === "all") {
  where.status = {
    [Op.in]: ['pending', 'processing', 'sent','failed', 'failed']
  }
}else {
  where.status = rawStatus;
}

//fetch with pagination
const {rows, count} = await EmailJob.findAndCountAll({
  where,
  order: [["created_at", "DESC"]],
  offset,
  limit
})

const totalItems = count;
const totalPages = Math.ceil(totalItems / limit)

  
  

 

  return res.status(200).json({
    emailJobs: rows,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      statusFilter:rawStatus
    }

  })
})