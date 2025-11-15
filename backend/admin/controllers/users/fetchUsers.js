const UTILS = require("../../../utils/utils");
const {User} = require("../../../models");

module.exports = UTILS.catchAsync(async (req, res) => {
    const {
        page: rawPage = "1",
        limit: rawLimit = "50",
        search = "",
    } = req.query

   

   const {page, limit, offset} =  UTILS.pagination(rawPage, rawLimit);

  

    const where = {};

    // Search by email or name
    if (search) {
        const searchTerm = `%${search.trim()}%`;
        where[Op.or] = [
            { email: { [Op.iLike]: searchTerm } },
            { first_name: { [Op.iLike]: searchTerm } },
             { last_name: { [Op.iLike]: searchTerm } },
        ];
    }


    const {rows, count} = await User.findAndCountAll({
        where,
        limit,
        offset,
        order: [["created_at", "DESC"]],
        attributes: [
            "id",
            "email",
            "first_name",
            "last_name",
            "created_at",
            "updated_at",
            "email_verified",
            "role"
        ]
    })

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