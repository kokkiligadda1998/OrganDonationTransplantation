const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/main.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/donor-registration.html", to: "donor-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/patient-registration.html", to: "patient-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/view-donors.html", to: "view-donors.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/view-patients.html", to: "view-patients.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/transplant-matching.html", to: "transplant-matching.html" }]),
    new CopyWebpackPlugin([{ from: "./src/css/bootstrap.css", to: "css/bootstrap.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/styles.css", to: "css/styles.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/style-home.css", to: "css/style-home.css" }]),
    new CopyWebpackPlugin([{ from: "./src/css/fontawesome-all.css", to: "css/fontawesome-all.css" }]),
    new CopyWebpackPlugin([{ from: "./src/images/originalLogo.svg", to: "images/originalLogo.svg" }]),
    new CopyWebpackPlugin([{ from: "./src/html/doctor-registration.html", to: "doctor-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/transporter-registration.html", to: "transporter-registration.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/view-transporters.html", to: "view-transporters.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/view-doctors.html", to: "view-doctors.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/admin.html", to: "admin.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/transporterDelivery.html", to: "transporterDelivery.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/track-status.html", to: "track-status.html" }]),
    new CopyWebpackPlugin([{ from: "./src/html/transplantation.html", to: "transplantation.html" }]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};