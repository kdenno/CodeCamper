exports.bootcamps = (req, res, next) => {
  res.status(200).json({ msg: "showing all bootcamps" });
};
exports.createbootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: "create a bootcamp" });
};

exports.getbootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: "get bootcamp " + req.params.Id });
};
exports.Updatebootcamp = (req, res, next) => {
  res
    .status(201)
    .json({ success: true, message: "update bootcamp " + req.params.Id });
};

exports.deletebootcamp = (req, res, next) => {
  res.status(201).json({ success: true, message: "delete a bootcamp" });
};