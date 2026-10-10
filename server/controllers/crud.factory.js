// Builds the five CRUD handlers + delete-all for a simple Mongoose model.
module.exports = function crud(Model, label) {
  return {
    list: async (req, res, next) => {
      try {
        res.status(200).json(await Model.find().sort({ createdAt: -1 }))
      } catch (e) { next(e) }
    },
    get: async (req, res, next) => {
      try {
        const doc = await Model.findById(req.params.id)
        if (!doc) return res.status(404).json({ error: `${label} not found` })
        res.status(200).json(doc)
      } catch (e) { next(e) }
    },
    create: async (req, res, next) => {
      try {
        res.status(201).json(await Model.create(req.body))
      } catch (e) { next(e) }
    },
    update: async (req, res, next) => {
      try {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        if (!doc) return res.status(404).json({ error: `${label} not found` })
        res.status(200).json(doc)
      } catch (e) { next(e) }
    },
    remove: async (req, res, next) => {
      try {
        const doc = await Model.findByIdAndDelete(req.params.id)
        if (!doc) return res.status(404).json({ error: `${label} not found` })
        res.status(200).json({ message: `${label} deleted`, id: doc._id })
      } catch (e) { next(e) }
    },
    removeAll: async (req, res, next) => {
      try {
        const result = await Model.deleteMany({})
        res.status(200).json({ message: `All ${label.toLowerCase()} records deleted`, deletedCount: result.deletedCount })
      } catch (e) { next(e) }
    },
  }
}
