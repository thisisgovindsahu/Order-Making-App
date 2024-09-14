const CategoryForm = ({ value, setValue, handleSubmit, btnName }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {btnName}
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
