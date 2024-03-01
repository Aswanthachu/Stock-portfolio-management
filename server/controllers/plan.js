

export const getPlanDetails = async(req,res)=>{
    try {
        const plan = req.params.plan
        if(plan==="premium"){
            const planDetails = {
                plan:"Premium",
                features:[
                    "Portfolio Management",
                    "List of Stocks to Buy",
                    "1 to 1 Support",
                    "12 Months",
                    "Additional 6 Month Offer",
                    "Broader Strategic Plan",
                    "Advanced SIPs",
                ],
                planAmount:"15789",
                planDiscount:"8874",
                shippingCharges:'0',
                tax:"0"
            }
            res.status(200).json(planDetails)
        }else if(plan==='standard'){
            const planDetails = {
                plan:"Standard",
                features:[
                    "Portfolio Management",
                    "List of Stocks to Buy",
                    "1 to 1 Support",
                    "3 Months",
                    "Advanced SIPs",
                ],
                planAmount:"3749",
                planDiscount:"825",
                shippingCharges:'0',
                tax:"0"

            }
            res.status(200).json(planDetails)
        // }else if(plan==='basic'){
        //     const planDetails = {
        //         plan:"Basic",
        //         features:[
        //             "Portfolio Management",
        //             "Stock List",
        //             "24/7 Support",
        //             "1 Months",
        //             "Advanced SIPs",
        //         ],
        //         planAmount:"489",
        //         planDiscount:"0",
        //         shippingCharges:'0',
        //         tax:"0"

        //     }
        //     res.status(200).json(planDetails)
    
        }else{
           
            res.status(404).json("invalid plan")
        }
        
    } catch (error) {
        res.status(500).json({error:error})
    }
   
}