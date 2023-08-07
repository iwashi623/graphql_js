const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

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

async function post(parent, args, context) {
  // ユーザーの取得
  const { userId } = context;
  if (!userId) {
    throw new Error("You are not authenticated!");
  }

  // リンクの作成
  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
}

module.exports = {
  signup,
  login,
  post,
};
