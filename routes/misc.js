const ip = (req) => (req.headers['x-forwarded-for'] || req.connection.remoteAddress).replace('::ffff:', '');
require('./auth.js');
const auth = require('./auth.js');
const {RecordModule} = require('../schema/record.js');
const Qrcode = require('qrcode');
const base58 = require('base-58');
const crypto = require('crypto');
console.log(auth);

// functions
// get qrcode
const getQrcode = async (code) => {
	var qrcode;
	await Qrcode.toDataURL(`${process.env.BASEURL}/${code}`)
		.then((url) => qrcode = url);
	return qrcode;
}

//// get random code
const getCode = () => base58.encode(crypto.randomBytes(4));

//// verify url
const isUrl = (url) => {
	var prasedUrl = require('url').parse(url.toString());
	// console.log(url);
	// console.log(prasedUrl);
	if( prasedUrl.host &&
		prasedUrl.hostname &&
		prasedUrl.pathname && 
		prasedUrl.protocol &&
		prasedUrl.slashes ){
		return true;
	}
	return false;
};

//// cRender custom render
function cRender(req, res, next){
	res.cRender = function(view, data){
		newData = {
			appName: process.env.appName,
			title: process.env.title,
			subtitle: process.env.subtitle,
			ip: ip(req),
			...data
		}
		res.render(view, newData);
	}
	next();
}

module.exports = {
	auth: auth,
	RecordModule: RecordModule,
	ip: ip,
	getQrcode: getQrcode,
	getCode: getCode,
	isUrl: isUrl,
	cRender: cRender
}
