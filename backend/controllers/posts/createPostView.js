/**
 * @typedef {import("../../types/user").User} UserType
 */
const {Post, PostViewEvent, Sequelize} = require("../../models");
const UTILS = require("../../utils/utils");

module.exports = UTILS.catchAsync(
    /**
     * @param {import("express").Request} req
     * @param {import("express").Response} res
     */
    async (req,res) => {

      
       const rawClientEventId = req.body.clientEventId;

        const viewSource = String(req.body.viewSource).trim() || null;
        const sessionId = String(req.body.sessionId).trim() || null;
        const clientEventId = typeof rawClientEventId === "string" && rawClientEventId.trim() ? String(rawClientEventId).trim() : null;
        const {postId} = req.params;

         /**@type {UserType} */
        const sessionUser = req.user;
        const userId = sessionUser?.id || null;

        if(!postId) throw UTILS.httpError(400,"postId is requred");

        if(!viewSource || !["feed", "modal", "video"].includes(viewSource)) throw UTILS.httpError(400,"Invalid source");

        if(!sessionId) throw UTILS.httpError(400,"sessionId is required");

        if(viewSource === "video" && !clientEventId)throw UTILS.httpError(400,"clientEventId is required for video views");

        const post = await Post.findByPk(postId);

        if(!post) throw UTILS.httpError(404,"Post not found");


        try {
            await PostViewEvent.create({
                post_id: postId,
                user_id: userId,
                session_id: sessionId,
                client_event_id: clientEventId,
                view_source: viewSource
            });

            const viewsCount = await PostViewEvent.count({
                where: {post_id: postId}
            });
            return res.status(201).json({
                success: true,
                postId,
                stats: {views_count: viewsCount}
            })

        } catch (error) {
          
            if(error instanceof Sequelize.UniqueConstraintError){
                const viewsCount = await PostViewEvent.count({
                where: {post_id: postId}
            });

                return res.status(200).json({
                success: true,
                postId,
                stats: {views_count: viewsCount}
            })

            }else {
                throw error;
            }
        }
    }
)