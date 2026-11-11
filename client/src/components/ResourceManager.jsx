import { useState } from 'react'
import { api } from '../lib/api.js'
import useApiList from '../lib/useApiList.js'
import RecordForm from './RecordForm.jsx'
import { Alert, EmptyState, Loading } from './Status.jsx'

// Lists one API resource and, when canEdit is true, provides the full
// create / update / delete workflow. With canEdit false the list is read-only
// (no buttons rendered) — the API would reject the writes anyway.
function ResourceManager({ resource, canEdit = false }) {
  const { items, setItems, loading, error, reload } = useApiList(resource.endpoint)
  const [mode, setMode] = useState(null) // null | 'create' | { edit: record }
  const [notice, setNotice] = useState(null) // { type, message }
  const [confirmingId, setConfirmingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const editingId = mode && mode !== 'create' ? mode.edit._id : null

  async function handleCreate(values) {
    const created = await api.post(resource.endpoint, values)
    setItems((prev) => [created, ...prev])
    setMode(null)
    setNotice({ type: 'success', message: `${resource.singular} “${resource.heading(created)}” was created.` })
  }

  async function handleUpdate(values) {
    const updated = await api.put(`${resource.endpoint}/${editingId}`, values)
    setItems((prev) => prev.map((item) => (item._id === updated._id ? updated : item)))
    setMode(null)
    setNotice({ type: 'success', message: `${resource.singular} “${resource.heading(updated)}” was updated.` })
  }

  async function handleDelete(item) {
    setDeletingId(item._id)
    setNotice(null)
    try {
      await api.del(`${resource.endpoint}/${item._id}`)
      setItems((prev) => prev.filter((i) => i._id !== item._id))
      setNotice({ type: 'success', message: `${resource.singular} “${resource.heading(item)}” was deleted.` })
    } catch (err) {
      setNotice({ type: 'error', message: `Delete failed: ${err.message}` })
    } finally {
      setDeletingId(null)
      setConfirmingId(null)
    }
  }

  function startCreate() {
    setNotice(null)
    setConfirmingId(null)
    setMode('create')
  }

  function startEdit(item) {
    setNotice(null)
    setConfirmingId(null)
    setMode({ edit: item })
  }

  return (
    <div className="resource-manager">
      <div className="resource-toolbar">
        <h2>
          {resource.label} <span className="count">({items.length})</span>
        </h2>
        <div className="toolbar-actions">
          <button type="button" className="btn-secondary btn-small" onClick={reload} disabled={loading}>
            Refresh
          </button>
          {canEdit && mode !== 'create' && (
            <button type="button" className="btn-primary btn-small" onClick={startCreate}>
              + Add {resource.singular.toLowerCase()}
            </button>
          )}
        </div>
      </div>

      {notice && (
        <Alert type={notice.type} onDismiss={() => setNotice(null)}>
          {notice.message}
        </Alert>
      )}

      {canEdit && mode === 'create' && (
        <div className="panel">
          <h3>New {resource.singular.toLowerCase()}</h3>
          <RecordForm
            idPrefix={`${resource.key}-new`}
            fields={resource.fields}
            onSubmit={handleCreate}
            submitLabel={`Create ${resource.singular.toLowerCase()}`}
            submittingLabel="Creating…"
            onCancel={() => setMode(null)}
          />
        </div>
      )}

      {loading && <Loading label={`Loading ${resource.label.toLowerCase()}…`} />}
      {!loading && error && (
        <Alert type="error">
          Could not load {resource.label.toLowerCase()}: {error}
        </Alert>
      )}
      {!loading && !error && items.length === 0 && (
        <EmptyState>No {resource.label.toLowerCase()} yet.</EmptyState>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="record-list">
          {items.map((item) => (
            <li key={item._id} className="record-card">
              {editingId === item._id ? (
                <>
                  <h3>Edit {resource.singular.toLowerCase()}</h3>
                  <RecordForm
                    idPrefix={`${resource.key}-${item._id}`}
                    fields={resource.fields}
                    initialValues={resource.toForm(item)}
                    onSubmit={handleUpdate}
                    submitLabel="Save changes"
                    onCancel={() => setMode(null)}
                  />
                </>
              ) : (
                <>
                  <h3>{resource.heading(item)}</h3>
                  <p className="record-meta">{resource.meta(item)}</p>
                  <p className="record-body">{resource.body(item)}</p>
                  {canEdit && (
                    <div className="record-actions">
                      {confirmingId === item._id ? (
                        <>
                          <span className="confirm-text">Delete permanently?</span>
                          <button
                            type="button"
                            className="btn-danger btn-small"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item._id}
                          >
                            {deletingId === item._id ? 'Deleting…' : 'Yes, delete'}
                          </button>
                          <button
                            type="button"
                            className="btn-secondary btn-small"
                            onClick={() => setConfirmingId(null)}
                            disabled={deletingId === item._id}
                          >
                            Keep
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="btn-secondary btn-small" onClick={() => startEdit(item)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-danger btn-small"
                            onClick={() => setConfirmingId(item._id)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ResourceManager
