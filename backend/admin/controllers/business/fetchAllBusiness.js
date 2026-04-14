const { Op } = require("sequelize");
const UTILS = require("../../../utils/utils");
const {Business} = require("../../../models");


module.exports = UTILS.catchAsync(async (req, res ) => {

    const {page: rawPage = "1", limit: rawLimit = "50", search=""} = req.query;


    const {page, limit, offset} = UTILS.pagination(rawPage, rawLimit);

    const where = {};

    // search by various business data

    if(search) {
        const searchTerm = `%${search.trim()}%`;
        where[Op.or] = [
            {name: { [Op.iLike]: searchTerm}},
            {description: {[Op.iLike]: searchTerm}},
            {address: {[Op.iLike]: searchTerm}},
            {city: {[Op.iLike]: searchTerm}},
            {state: {[Op.iLike]: searchTerm}},
            {country: {[Op.iLike]: searchTerm}},
            {zip_code: {[Op.iLike]: searchTerm}},
            {phone: {[Op.iLike]: searchTerm}},
            {email: {[Op.iLike]: searchTerm}}


        ]
    }


    const {rows, count} = await Business.findAndCountAll({
        where,
        limit,
        offset,
        order: [["created_at", "DESC"]],
       
    });

    const totalItems = count;
    const totalPages = Math.ceil(totalItems / limit);

  

    return res.json({
        rows,
        meta: {
            totalItems,
            totalPages,
            limit,
            page
        }
    })
})