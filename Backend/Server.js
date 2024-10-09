const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { sendMail } = require('./emailService');
const app = express();
const {ObjectId} = require('mongodb');
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/fashiondb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  sdt: String
}, { versionKey: false });

const accountSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  sdt: String,
  verifynumber: String
}, {versionKey: false});

const ProductSchema = new mongoose.Schema({
  product_name: String,
  product_link: [String],
  product_price: Number,
  product_color: [String],
  product_size: [String],
  product_type: [{
    color: String,
    size: String,
    quantity: Number
  }],
  product_quantity: Number,
  product_description: String,
  product_rating: Number,
  product_revenue: Number, 
  product_sold_quantity: Number, 
  product_category: String,
  reviews: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      rating: Number,
      comment: String,
      date: { type: Date, default: Date.now }
    }
  ]
}, { versionKey: false });

const FavoriteSchema = new mongoose.Schema({
  fp_id_kh: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fp_id_sp: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { versionKey: false });

const OrderSchema = new mongoose.Schema({
  order_kh : {
    id_kh: mongoose.Schema.Types.ObjectId,
    name_kh: String,
    sdt_kh: String,
    address: String
  },
  order_price: Number,
  order_quantity: Number,
  order_product: Array,
  order_status: String,
  order_voucher: String,
  order_pttt: String,
  order_date1: Date,
  order_date2: Date
}, { versionKey: false });

const VoucherSchema = new mongoose.Schema({
  voucher_condition : Number,
  voucher_value : Number,
  voucher_quantity : Number
}, {versionKey : false});

const RevenueSchema = new mongoose.Schema({
  year: Number,
  revenue: Array
}, {versionKey : false});

const User = mongoose.model('accounts', UserSchema);
const Unc = mongoose.model("unverified_accounts", accountSchema);
const Product = mongoose.model('Product', ProductSchema);
const FavoriteProduct = mongoose.model('favorite_products', FavoriteSchema);
const Order = mongoose.model("orders", OrderSchema);
const Voucher = mongoose.model("vouchers", VoucherSchema);
const Revenue = mongoose.model("revenues", RevenueSchema);

const SECRET_KEY = 'your_secret_key'; // Thay bằng key bí mật của bạn

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ email: username, password: password }).then((data) => {
    if (data) {
      const token = jwt.sign({ userId: data._id, email: data.email }, SECRET_KEY, { expiresIn: '1h' });
      res.send({ status: 'success', token: token, user: data });
    } else {
      res.send({ status: 'fail' });
    }
  });
});

app.post('/register', (req, res) => {
  const { name, sdt, email, password } = req.body;
  User.findOne({email : email}).then((data)=>{
    if(data) res.send({message : "Email đã tồn tại", status : "failed"});
    else 
    {
      Unc.findOne({email : email}).then((data2)=>{
        if(data2) res.send({message: "Email đã đăng ký nhưng chưa xác thực. Kiểm tra email để kích hoạt tài khoản.", status: "failed"});
        else {
          let v_number = Math.floor(Math.random()*1000000);
          v_number = v_number.toString().padStart(6,'0');
          const newUser = new Unc({email, name, password, sdt, verifynumber: v_number});
          newUser.save().then(()=>{
            sendMail(email, "Xác thực tài khoản TuBo Club", v_number);
            res.send({message: "Kiểm tra email để kích hoạt tài khoản", status: "success"});
          });
        }
      });
    }
  });
});

app.post('/search', (req, res) => {
  const { email } = req.body;
  console.log(email); 
  Unc.findOne({ email : email }, {password: 0}).then((data) => {
      if(data) res.send({ status: "success", user: data });
      else User.findOne({email: email}, {password: 0}).then((userdata) => {
        if(userdata) res.send({ status: "failed", message: "Email đã đăng ký. Hãy đăng nhập."});
        else res.send({ status: "failed", message: "Email not found"});
      });
  })
});

app.post('/verify', (req, res) => {
  const { email, number } = req.body;
  console.log(email, number);
  Unc.findOne({ email : email, verifynumber: number }).then((data) => {
    if(data) {
      const newUser = new User({
        name: data.name,
        sdt: data.sdt,
        email: data.email,
        password: data.password
      });
      newUser.save().then(() => {
        Unc.deleteOne({ email: email }).then(() => {
          res.send({ status: "success", message: "Tài khoản đã được kích hoạt"});
        });
      });
    } else {res.send({ status: "failed", message: "Mã xác minh chưa chính xác"});}
  });
});

app.post('/resend', (req, res) => {
  const { email } = req.body;
  console.log(email);
  waitUser.findOne({ email : email }).then((data) => {
      if(data){
          sendMail(email, "Mã xác nhận tài khoản TuBo Club" ,data.verifiedNumber);
          res.send({ status: "success", message: "Mã xác nhận đã được gửi"});
      }
      else{
          res.send({ status: "failed", message: "Email not found"});
      }
  })
});

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      res.send({ status: 'fail', message: 'Email không tồn tại' });
    } else {
      /*const newPassword = Math.random().toString(36).slice(-8);
      user.password = newPassword;*/
      user.save().then(() => {
        sendMail(email, 'Mật khẩu của bạn', `Mật khẩu của bạn là: ${user.password}`);
        res.send({ status: 'success', message: 'Mật khẩu đã được gửi đến email của bạn' });
      });
    }
  });
});

app.post('/update-name', (req, res) => {
  const { email, name } = req.body;
  User.findOneAndUpdate({ email: email }, { name: name }, { new: true }).then((user) => {
    if (user) {
      res.send({ status: 'success', user });
    } else {
      res.send({ status: 'fail', message: 'User not found' });
    }
  }).catch(error => res.send({ status: 'fail', message: error.message }));
});

app.post('/update-phone', (req, res) => {
  const { email, phone } = req.body;
  User.findOneAndUpdate({ email: email }, { sdt: phone }, { new: true }).then((user) => {
    if (user) {
      res.send({ status: 'success', user });
    } else {
      res.send({ status: 'fail', message: 'User not found' });
    }
  }).catch(error => res.send({ status: 'fail', message: error.message }));
});

app.post('/update-password', (req, res) => {
  const { email, password } = req.body;
  User.findOneAndUpdate({ email: email }, { password: password }, { new: true }).then((user) => {
    if (user) {
      res.send({ status: 'success', user });
    } else {
      res.send({ status: 'fail', message: 'User not found' });
    }
  }).catch(error => res.send({ status: 'fail', message: error.message }));
});

app.get('/products', (req, res) => {
  Product.find().then(products => {
    res.send({ status: 'success', products });
  }).catch(error => {
    res.send({ status: 'fail', message: error.message });
  });
});

app.get('/orders', (req, res) => {
  Order.find().then(od => {
    res.send({status: 'success', od});
  }).catch(error => {
    res.send({status: 'fail', message: error.message });
  });
});

app.get('/ordersid', (req, res) => {
  const userId = req.query.userId; // Sử dụng req.query để lấy userId
  console.log('Received userId:', userId); // Kiểm tra giá trị userId
  Order.find({ 'order_kh.id_kh': userId, 'order_status': "Hoàn tất" }).then(orders => {
    console.log('Orders found:', orders);
    res.send({ status: 'success', orders });
  }).catch(error => {
    res.send({ status: 'fail', message: error.message });
  });
});

app.post('/add-product', (req, res) => {
  const newProduct = new Product(req.body);
  newProduct.save()
      .then(product => res.json({ status: 'success', product }))
      .catch(err => res.status(400).json({ status: 'error', message: err.message }));
});

app.post('/update-product/:id', (req, res) => {
  const { id } = req.params;
  const updatedProductData = req.body;
  Product.findByIdAndUpdate(id, updatedProductData, { new: true })
    .then(updatedProduct => {
      if (!updatedProduct) {
        return res.status(404).json({ status: 'error', message: 'Product not found' });
      }
      res.json({ status: 'success', product: updatedProduct });
    })
    .catch(error => res.status(500).json({ status: 'error', message: error.message }));
});


app.post('/remove-product', (req, res) => {
  const { productid } = req.body;
  Product.findOneAndDelete({ _id : productid }).then(() => {
    res.send({ status: 'success', message: 'Product removed' });
  }).catch(error => {
    res.send({ status: 'fail', message: error.message });
  });
});

app.get('/accs', (req, res) => {
  User.find().then(accs => {
    res.send({ status: 'success', accs });
  }).catch(error => {
    res.send({ status: 'fail', message: error.message });
  });
});

app.post('/add-favorite', (req, res) => {
  const { userId, productId } = req.body;
  const newFavorite = new FavoriteProduct({ fp_id_kh: userId, fp_id_sp: productId });
  newFavorite.save().then(() => {
    res.send({ status: 'success', message: 'Product added to favorites' });
  }).catch(error => {
    res.send({ status: 'fail', message: error.message });
  });
});

app.post('/remove-favorite', (req, res) => {
  const { userId, productId } = req.body;
  FavoriteProduct.findOneAndDelete({ fp_id_kh: userId, fp_id_sp: productId }).then(() => {
    res.send({ status: 'success', message: 'Product removed from favorites' });
  }).catch(error => {
    res.send({ status: 'fail', message: error.message });
  });
});

app.get('/favorites', (req, res) => {
  const { userId } = req.query;
  FavoriteProduct.find({ fp_id_kh: userId }).populate('fp_id_sp').then(favorites => {
    res.send({ status: 'success', favorites });
  }).catch(error => {
    res.send({ status: 'fail', message: error.message });
  });
});

app.get('/orders/:id', (req, res) => {
  let { id } = req.params;
  id = new ObjectId(id);
  Order.find({ "order_kh.id_kh": id }).then((data)=> {
      res.status(200);
      res.send(data);
  })
});

app.get('/vouchers', (req, res) => {
  Voucher.find({}).then((data) => {
    if (data) res.send({status: "success", vouchers: data})
      else res.send({status: "error", message: "Failed"})
  })
});

app.get('/vouchers/:id', async (req, res) => {
  try {
      const voucher = await Voucher.findById(req.params.id);
      if (!voucher) {
          return res.status(404).send({ error: 'Voucher not found' });
      }
      res.send(voucher);
  } catch (error) {
      res.status(500).send({ error: 'Server error' });
  }
});

app.put('/vouchers/use/:id', async (req, res) => {
  try {
      const voucher = await Voucher.findById(req.params.id);
      if (!voucher || voucher.voucher_quantity <= 0) {
          return res.status(400).send({ error: 'Voucher không hợp lệ hoặc đã hết số lượng' });
      }
      voucher.voucher_quantity -= 1;
      await voucher.save();
      res.send(voucher);
  } catch (error) {
      res.status(500).send({ error: 'Server error' });
  }
});

app.post('/orders', async (req, res) => {
  try {
    const { order_kh, order_price, order_quantity, order_product, order_status, 
            order_voucher, order_pttt, order_date1, order_date2 } = req.body;
    if (!ObjectId.isValid(order_kh.id_kh)) {return res.status(400).send({ error: 'Invalid id_kh format' });}
    const orderKhWithObjectId = {
          ...order_kh,
          id_kh: new ObjectId(order_kh.id_kh) 
      };
    const newOrder = new Order({
          order_kh: orderKhWithObjectId,
          order_price,
          order_quantity,
          order_product,
          order_status,
          order_voucher,
          order_pttt,
          order_date1,
          order_date2
    });
    await newOrder.save();
    res.status(201).send(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).send({ error: 'Server error' });
  }
});

/*app.put('/orders/:id/status', async (req, res) => {
  try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await Order.findById(id);
      if (!order) {
          return res.status(404).send({ status: 'fail', message: 'Order not found' });
      }
      order.order_status = status;
      await order.save();
      res.send({ status: 'success', order });
  } catch (error) {
      res.status(500).send({ status: 'error', message: 'Server error' });
  }
});*/

app.put('/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Order not found' });
    }

    order.order_status = status;

    if (status === 'Hoàn tất') {
      order.order_date2 = new Date();

      for (let product of order.order_product) {
        const productId = product.id_product;
        const productDoc = await Product.findById(productId);

        if (productDoc) {
          productDoc.product_sold_quantity += product.quantity_product;
          productDoc.product_revenue += product.quantity_product * productDoc.product_price;
          productDoc.product_quantity -= product.quantity_product;

          const typeIndex = productDoc.product_type.findIndex(t => t.color === product.color_product && t.size === product.size_product);
          if (typeIndex !== -1) {
            productDoc.product_type[typeIndex].quantity -= product.quantity_product;
          }

          await productDoc.save();
        }
      }

      const year = new Date().getFullYear();
      const month = new Date().getMonth();

      let revenueDoc = await Revenue.findOne({ year });

      if (!revenueDoc) {
        revenueDoc = new Revenue({ year, revenue: new Array(12).fill(0) });
      }

      revenueDoc.revenue[month] += (order.order_price) / 1000;

      await revenueDoc.save();
    }

    await order.save();

    res.json({ status: 'success' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ status: 'fail', message: error.message });
  }
});



app.post('/vouchers', async (req, res) => {
  const { voucher_condition, voucher_value, voucher_quantity } = req.body;

  if (!voucher_condition || !voucher_value || !voucher_quantity) {
      return res.status(400).json({ status: 'error', message: 'All fields are required.' });
  }

  try {
      const newVoucher = new Voucher({
          voucher_condition,
          voucher_value,
          voucher_quantity
      });

      await newVoucher.save();

      res.status(201).json({ status: 'success', message: 'Voucher added successfully.' });
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'An error occurred while adding the voucher.' });
  }
});

app.delete('/vouchers/:id', async (req, res) => {
  const { id } = req.params;

  try {
      const deletedVoucher = await Voucher.findByIdAndDelete(id);

      if (!deletedVoucher) {
          return res.status(404).json({ status: 'error', message: 'Voucher not found.' });
      }

      res.status(200).json({ status: 'success', message: 'Voucher deleted successfully.' });
  } catch (error) {
      res.status(500).json({ status: 'error', message: 'An error occurred while deleting the voucher.' });
  }
});

app.get('/api/revenue', (req, res) => {
  Revenue.find({},{_id: 0}).then((data) => {
      res.status(200).send(data);
  });
});

app.get('/api/users/number', (req, res) => {
  User.countDocuments({}).then((data) => {
      res.status(200).send(data.toString());
  });
});

app.post('/products/:id/review', async (req, res) => {
  const { id } = req.params;
  const { rating, comment, userId } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }

    // Check if the user has purchased the product
    const order = await Order.findOne({ 'order_product.id_product': id, 'order_kh.id_kh': userId });
    if (!order) {
      return res.status(403).json({ status: 'fail', message: 'You can only review products you have purchased' });
    }

    // Add the review
    product.reviews.push({ userId, rating, comment });

    // Update the product rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.product_rating = totalRating / product.reviews.length;

    await product.save();
    res.json({ status: 'success', message: 'Review added successfully' });

  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ status: 'fail', message: error.message });
  }
});


app.get('/products/:id', async (req, res) => {
  const { id } = req.params; 

  try {
    const product = await Product.findById(id).populate('reviews.userId', 'username');
    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Product not found' });
    }
    res.json(product);

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ status: 'fail', message: error.message });
  }
});


const port = 3001;
app.listen(port, () => { console.log(`Server is running on port ${port}`); });
