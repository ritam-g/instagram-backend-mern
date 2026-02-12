const postModel = require("../model/post.model");
const ImageKit = require('@imagekit/nodejs');

const imagekit = new ImageKit({
  publicKey: "xxx",
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io/xxx"
});

async function postController(req, res) {

    const file = await imagekit.files.upload({
        file: req.file.buffer.toString("base64"),
        fileName: "Test"
    });

    res.send(file);
}


module.exports = { postController };
