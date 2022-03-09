const User = require('../models/user')
const Plan = require('../models/plan')
const Day = require('../models/day')

const findOnePlanByPlanId = async ({ planId }) => {
    const findPlan = await Plan.findOne({ _id: planId })
    return findPlan;
}
const findAllPlanByUserId = async ({ userId }) => {
    const findPlan = await Plan.find({ userId })
    return findPlan;
}

module.exports = {
    
}