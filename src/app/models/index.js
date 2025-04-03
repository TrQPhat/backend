// models/index.js
const sequelize = require("../../config/db");
const User = require("./users");
const Product = require("./products");
const Cart = require("./carts");
const Category = require("./categories");
const Order = require("./orders");
const OrderDetail = require("./orderDetails");
const Invoice = require("./invoices");
const Review = require("./reviews");
const Staff = require("./Staff");
const Voucher = require("./vouchers");
const Ingredient = require("./ingredients");
const Payment = require("./payments");
const Delivery = require("./deliveries");
const Table = require("./tables");
const ProductIngredient = require("./product_ingredient");

// Define associations
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

Order.hasOne(Invoice, { foreignKey: "order_id" });
Invoice.belongsTo(Order, { foreignKey: "order_id" });

Order.hasMany(OrderDetail, { foreignKey: "order_id", onDelete: "CASCADE" });
OrderDetail.belongsTo(Order, { foreignKey: "order_id" });

User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Cart, { foreignKey: "product_id" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

Product.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Product, { foreignKey: "category_id" });

Product.hasMany(Review, { foreignKey: "product_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });

Product.hasMany(OrderDetail, { foreignKey: "product_id" });
OrderDetail.belongsTo(Product, { foreignKey: "product_id" });

User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Ingredient, { foreignKey: "product_id" });
Ingredient.belongsTo(Product, { foreignKey: "product_id" });

// Order.hasOne(Delivery, { foreignKey: "id", onDelete: "CASCADE" });
// Delivery.hasOne(Order, { foreignKey: "delivery_id" });
Order.belongsTo(Delivery, { foreignKey: "deliveries_id", onDelete: "CASCADE" });
Order.belongsTo(Payment, { foreignKey: "payments_id", onDelete: "CASCADE" });

// Order.hasOne(Payment, { foreignKey: "payment_id", onDelete: "CASCADE" });
// Payment.hasOne(Order, { foreignKey: "payment_id" });
Product.belongsToMany(Ingredient, {
  through: ProductIngredient,
  foreignKey: "product_id",
  otherKey: "ingredient_id",
  as: "ingredients", // Alias này dùng khi include từ Product
});

Ingredient.belongsToMany(Product, {
  through: ProductIngredient,
  foreignKey: "ingredient_id",
  otherKey: "product_id",
  as: "products", // Alias này dùng khi include từ Ingredient
});

// ✅ Thêm quan hệ giữa ProductIngredient và Product + Ingredient
ProductIngredient.belongsTo(Product, {
  foreignKey: "product_id",
  as: "product", // Alias này dùng khi include từ ProductIngredient
});

ProductIngredient.belongsTo(Ingredient, {
  foreignKey: "ingredient_id",
  as: "ingredient", // Alias này dùng khi include từ ProductIngredient
});
module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  Category,
  Order,
  OrderDetail,
  Invoice,
  Review,
  Staff,
  Voucher,
  Ingredient,
  Payment,
  Delivery,
  ProductIngredient,
  Table,
};