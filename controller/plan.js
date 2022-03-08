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

const deletePlan = async (req, res) => {
    const { uesrId } = res.locals.user;
    const { planId } = req.params;

    const findPlan = await planService.findOnePlanByPlanId({ planId });
    if (findPlan.userId.toHexString() !== userId) {
        return res
            .status(401)
            .json({ result: 'fail', message: '본인의 여행만 변경할수 있습니다.' });
    } else {
        await planService.deletePlanByPlanId({ planId });
        res.json({
            result: 'success',
            message: '삭제 완료',
        });
    }
};
module.exports = {
    addNewPlan,
    deletePlan,
};
