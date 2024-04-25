const {httpRequest} = require("../utils/httpRequest.js");
const residentModel = require("../models/residentModel.js");
const tags = require("../public/assets/tag.js");

module.exports = {
  myReview: (req, res) => {
    /* msa */
    const postOptionsResident = {
      host: 'stop_bang_auth_DB',
      port: process.env.PORT,
      path: `/db/resident/findById`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };
    const requestBody = {username: req.headers.auth};
    httpRequest(postOptionsResident, requestBody)
      .then((res) => {
        const user_id = res.body[0].id;
        const getOptions = {
          host: 'stop_bang_review_DB',
          port: process.env.PORT,
          path: `/db/review/findAllByUserId/${user_id}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        };
    
        return httpRequest(getOptions);
      })
      .then(result => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          res.json({
            reviews: result.body,
            tagsData: tags,
            path: 'myreview'
          });
        }
      });
  },
  openReview: (req, res) => {
    residentModel.getOpenedReviewById(req.headers.auth, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.json({
          openReviews: result[0],
          tagsData: tags,
          path: 'openreview'
        });
      }
    });
  },
  bookmark: (req, res) => {
    residentModel.getBookMarkById(req.headers.auth, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.json({
          bookmarks: result[0],
          path: 'bookmark'
        });
      }
    });
  },
  deleteBookmark: (req, res) => {
    residentModel.deleteBookMarkById(req.params.id, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.redirect("/resident/bookmark");
      }
    });
  },
  settings: (req, res) => {
    /* msa */
    const postOptions = {
      host: 'stop_bang_auth_DB',
      port: process.env.PORT,
      path: `/db/resident/findById`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const requestBody = {
      username: req.headers.auth
    };
    httpRequest(postOptions, requestBody)
      .then(result => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          return res.json({
            resident: result.body[0],
            path: "settings"
          });
        }
      });
  },
  updateSettings: (req, res) => {
    /* msa */
    const postOptions = {
      host: 'stop_bang_auth_DB',
      port: process.env.PORT,
      path: `/db/resident/update`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const requestBody = req.body;
    if (!requestBody.birth) requestBody.birth = null;
    httpRequest(postOptions, requestBody)
      .then(result => {
        if (result === null) {
          console.log("error occured: ", err);
        } else {
          return res.status(302).redirect("/resident/settings");
        }
      });
  },
  updatePassword: (req, res) => {
    /* msa */
    const postOptions = {
      host: 'stop_bang_auth_DB',
      port: process.env.PORT,
      path: `/db/resident/updatepw`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const requestBody = req.body;
    requestBody.username = req.headers.auth;
    httpRequest(postOptions, requestBody)
      .then(result => {
        if (result === null) {
          if (err === "pwerror") {
            res.json({ message: "입력한 비밀번호가 잘못되었습니다." });
          }
        } else {
          res.redirect("/resident/settings");
        }
      });
  },
  deleteAccount: async (req, res) => {
    try {
      /* msa */
      const postOptions = {
        host: 'stop_bang_auth_DB',
        port: process.env.PORT,
        path: `/db/resident/delete`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      const requestBody = req.body;

      httpRequest(postOptions, requestBody)
        .then(() => {
          res.clearCookie("userType");
          res.clearCookie("authToken");
          return res.status(302).redirect("/");
        });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
};