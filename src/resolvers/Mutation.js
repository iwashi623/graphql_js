const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

APP_SECRET = "GraphQL";

// ユーザーの新規登録
async function signup(parent, args, context) {
  // パスワードのハッシュ化
  const password = await bcrypt.hash(args.password, 10);

  // ユーザーの作成
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  // JWTの生成
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 生成したJWTを返す
  return {
    token,
    user,
  };
}

// ユーザーのログイン
async function login(parent, args, context) {
  // ユーザーの取得
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email,
    },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  // パスワードの照合
  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  // JWTの生成
  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  // 生成したJWTを返す
  return {
    token,
    user,
  };
}

module.exports = {
  signup,
  login,
};
