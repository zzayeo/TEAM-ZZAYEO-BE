const planService = require('../services/plan');

const addNewPlan = async (req, res) => {
    const { user } = res.locals;
    const { title, startDate, endDate, destination, style, withlist } = req.body;

    const newPlan = await planService.createPlan({
        user,
        title,
        startDate,
        endDate,
        destination,
        style,
        withlist,
    });
    res.json({
        result: 'success',
        message: '성공',
        planId: newPlan.planId,
    });
};

module.exports = {
    addNewPlan,
};
