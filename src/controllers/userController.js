const user = async function(req,res){
    let data = req.body
    res.send(data)
}

module.exports.user=user