export default (amountMilkInLiters, distanceInKM, month ) => {
    if (!amountMilkInLiters || !distanceInKM) {
        throw new Error('amountMilkInLiters and distanceInKM are required');
    }
    let basePrice = 0;
    let finalPrice=0;
    const currentMonth = month || new Date().getMonth()+1;

    if(currentMonth>6){
        basePrice = 1.95
    }
    if(currentMonth<=6){
        basePrice = 1.80
    }
    
    if(distanceInKM > 50 ){
        finalPrice = (amountMilkInLiters* basePrice) - ((50 * 0.05) + ((distanceInKM - 50) * 0.06));
  
    }
    if(distanceInKM <= 50){
        finalPrice = (amountMilkInLiters* basePrice) - (50 * 0.05) ;
    }

    if(amountMilkInLiters > 10000 && currentMonth > 6){
        finalPrice += (amountMilkInLiters * 0.01)
    }
    
    return finalPrice;
}