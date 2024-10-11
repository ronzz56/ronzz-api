const { db } = require("./database");
const { email } = require("./email");

const resetLimit = async () => {
  const users = await db.find({})
  users.forEach(async (data) => {
    const { username } = data
    if (!username == null) {
      return db.updateOne({
        username: username
      }, {
        limit: 25
      }, function (err, res) {
        if (err) throw err
      })
    }
  })
}

const updateExpiredStandard = async (user) => {
  if (user.standard && user.standardTime <= Date.now()) {
    user.standard = false;
    user.standardTime = 0;
    user.apikey = user.defaultKey
    await user.save();
    const html = await email.htmlNotif(user.username, "Standard")
    await email.send(user.email, "Ronzz API Notifications", html)
    console.log(`Standard expired for user: ${user.username}`);
  }
};

const expiredStandardUsers = async () => {
  try {
    const users = await db.find({ standard: true });

    for (const user of users) {
      await updateExpiredStandard(user);
    }
  } catch (error) {
    console.error(`Error updating expired standard users: ${error}`);
  }
};

const updateExpiredPremium = async (user) => {
  if (user.premium && user.premiumTime <= Date.now()) {
    user.premium = false;
    user.premiumTime = 0;
    user.apikey = user.defaultKey
    await user.save();
    const html = await email.htmlNotif(user.username, "Premium")
    await email.send(user.email, "Ronzz API Notifications", html)
    console.log(`Premium expired for user: ${user.username}`);
  }
};

const expiredPremiumUsers = async () => {
  try {
    const users = await db.find({ premium: true });

    for (const user of users) {
      await updateExpiredPremium(user);
    }
  } catch (error) {
    console.error(`Error updating expired premium users: ${error}`);
  }
};

module.exports = {
  resetLimit,
  updateExpiredStandard,
  expiredStandardUsers,
  updateExpiredPremium,
  expiredPremiumUsers
}