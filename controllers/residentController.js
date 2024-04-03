const residentModel = require("../models/residentModel.js");
const tags = require("../public/assets/tag.js");
const jwt = require("jsonwebtoken");

module.exports = {
  myReview: (req, res) => {
    residentModel.getReviewById(req.headers.auth, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.json({
          reviews: result[0],
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
    residentModel.getResidentById(req.headers.auth, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.json(
          {
            resident: result[0][0],
            path: "settings",
          }
        );
      }
    });
  },
  updateSettings: (req, res) => {
    const body = req.body;
    if (body.birth === "") body.birth = null;
    residentModel.updateResident(req.headers.auth, body, (result, err) => {
      if (result === null) {
        console.log("error occured: ", err);
      } else {
        res.redirect("/resident/settings");
      }
    });
  },
  updatePassword: (req, res) => {
    residentModel.updateResidentPassword(req.headers.auth, req.body, (result, err) => {
      if (result === null) {
        if (err === "pwerror") {
          res.render('notFound.ejs', {message: "입력한 비밀번호가 잘못되었습니다."});
        }
      } else {
        res.redirect("/resident/settings");
      }
    });
  },
  deleteAccount: async (req, res) => {
    try {
      await residentModel.deleteAccountProcess(req.headers.auth);
      res.clearCookie("userType");
      res.clearCookie("authToken");
      res.status(302).redirect("/");
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
};