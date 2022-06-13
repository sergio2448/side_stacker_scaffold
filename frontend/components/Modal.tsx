const Modal = ({children, isOpen, closeModal}) => {
  return (
    <article>
      <div className={`modal ${isOpen && "is-open"}`}>
        <button className="modal-close" onClick={closeModal}>X</button>
        {children}
      </div>
    </article>
  )
}

export default Modal