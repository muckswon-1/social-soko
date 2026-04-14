'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_view_events', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
      },
        post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "posts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

       user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      session_id: {
        type: Sequelize.STRING,
        allowNull: false
        
      },
      view_source: {
        type: Sequelize.STRING,
        allowNull: false
      },
      client_event_id: {
        type: Sequelize.UUID,
        allowNull: true
      },
        created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("post_view_events",["post_id"]);
    await queryInterface.addIndex("post_view_events",["user_id"]);
     await queryInterface.addIndex("post_view_events",["session_id"]);
      await queryInterface.addIndex("post_view_events",["view_source"]);
       await queryInterface.addIndex("post_view_events",["client_event_id"]);

    /**
     * Uniqueness for FEED + MODAL (once per post per session)
     *  - Logged in: unique (post_id, user_id, session_id, source) where user_id IS NOT NULL and source IN ('feed','modal')
     *  Anonymous: unique (post_id, session_id, source) where user_id IS NULL and source IN ('feed','modal')
     */

    await queryInterface.addIndex("post_view_events",
      ["post_id", "user_id","session_id", "view_source"],
      {
        unique: true,
        name: "post_view_events_unique_post_feed_modal_user",
        where: {
          user_id: {[Sequelize.Op.ne]: null},
          view_source: {[Sequelize.Op.in]: ["feed","modal"]}
        }
      }
    );

    await queryInterface.addIndex("post_view_events",
      ["post_id","session_id","view_source"],
      {
        unique: true,
        name: "post_view_events_unique_post_feed_modal_anonymous",
        where: {
          user_id: null,
          view_source: {[Sequelize.Op.in]: ["feed","modal"]},
          
        }
      }
    );

    await queryInterface.addIndex("post_view_events", ["client_event_id"],
      {
        unique: true,
        name: "post_view_events_unique_client_event_id",
        where: {
          client_event_id: {[Sequelize.Op.ne]: null}
        }
      }
    )


  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('post_view_events');
  }
};