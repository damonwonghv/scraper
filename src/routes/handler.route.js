const handleJsonResponse = (res, data) =>
  res.status(200).json({ success: true, data: data });
const handleSendResponse = (res, data) => {
  res.status(200).send(data);
};
const handleErrorResponse = (res, error) =>
  res.status(400).json({ success: false, error: error });

module.exports = {
  handleJsonResponse,
  handleSendResponse,
  handleErrorResponse
};
