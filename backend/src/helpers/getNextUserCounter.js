const getNextUserCounterId = async (model, u_id, counterField = 'counter') => {
  try {
    const lastRecord = await model.findOne({
      where: { u_id },
      order: [[counterField, 'DESC']],
      attributes: [counterField],
    });
    const nextNumber = lastRecord ? lastRecord[counterField] + 1 : 1;
    return nextNumber;
  } catch (err) {
    console.error(`❌ Error in getNextUserCounter for ${model.name}:`, err);
    throw err;
  }
};
export default getNextUserCounterId;
