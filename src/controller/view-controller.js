const viewHome = (req,res) =>  {
    const body = req.query;
    console.log(body);
    res.render('home', body);
};
const joinHome = (req,res) => {
    res.render('form');
};
module.exports={
    viewHome, joinHome
};