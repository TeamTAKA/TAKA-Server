export default {
  success: (status: number, message: String, data?: Object) => {
    return {
      status: status,
      success: true,
      message: message,
      data: data,
    };
  },
  fail: (status: number, message: String) => {
    return {
      status: status,
      success: false,
      message: message,
    };
  },
};
