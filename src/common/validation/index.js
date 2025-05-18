const password = (value, helpers) => {
  if (
    value.length < 8 ||
    value.length > 64 ||
    !value.match(/\d/) ||
    !value.match(/[a-zA-Z]/)
    // !value.match(/[-!@$%^&*()_+|~=`{}[\]:";'<>?,./]/)
  ) {
    return helpers.message(
      'Kata sandi harus berisi minimal 8 karakter dan maksimal 64 karakter, dan setidaknya berisi 1 huruf, 1 angka.',
    );
  }
  return value;
};

module.exports = {
  password,
};
