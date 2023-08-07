const jwt = require("jsonwebtoken");
APP_SECRET = "GraphQL-is-aw3some";

// Tokenを複合するための関数
function getTokenPayload(token) {
  return jwt.verify(token, APP_SECRET);
}

// ユーザーIDを取得するための関数
function getUserId(req, authToken) {
  if (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      // 邪魔なBearerを削除
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("No token found");
      }

      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }

  throw new Error("Not authenticated");
}

module.exports = {
  APP_SECRET,
  getUserId,
};
