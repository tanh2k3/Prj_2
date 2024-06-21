const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { sendMail } = require('./emailService');
const app = express();
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
  product_link: Array,
  product_price: String,
  product_color: Array,
  product_size: Array,
  product_type: Array,
  product_quantity: Number,
  product_description: String,
  product_rating: Number,
  product_revenue: Number,
  product_sold_quantity: Number,
  product_category: String
}, { versionKey: false });

const FavoriteSchema = new mongoose.Schema({
  fp_id_kh: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fp_id_sp: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
}, { versionKey: false });

const User = mongoose.model('accounts', UserSchema);
const Unc = mongoose.model("unverified_accounts", accountSchema);
const Product = mongoose.model('Product', ProductSchema);
const FavoriteProduct = mongoose.model('favorite_products', FavoriteSchema);

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

const port = 3001;
app.listen(port, () => { console.log(`Server is running on port ${port}`); });
