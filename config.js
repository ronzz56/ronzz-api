const options = {
    title: "RonzzAPI",
    creator: "Ronzz YT",
    
    port: 3000,
    limit: 25,
    standardLimit: 500,
    premiumLimit: 1000
  }
  
  const mongoURL = "mongodb+srv://mahekalonga71:SgqGwK922Nw71uih@cluster0.yre0k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  
  const google = {
    clientId: "170073054644-f1l2mdd22dv66iq8bdavm5i1qiopg7ap.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://ronzz-api.vercel.app/auth/google/callback"
  }
  
  const smtp = {
    email: "zikxzz4@gmail.com",
    pass: "fzmvnnnkdympwhwt"
  }
  
  module.exports = {
    options,
    mongoURL,
    google,
    smtp
  }