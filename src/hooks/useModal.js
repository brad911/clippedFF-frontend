import { useCallback } from "react";
import { useEffect, useState } from "react";

const useModal = (isActive) => {
  const [isModalActive, setIsModalActive] = useState();
  const [meta, setMeta] = useState({});

  const toggleModalActive = useCallback((toSet) => {
    if (toSet === "open") {
      setIsModalActive(() => true);
    } else if (toSet === "close") {
      setIsModalActive(() => false);
    } else {
      setIsModalActive((prevState) => !prevState);
    }
  }, []);

  useEffect(() => {
    setIsModalActive(!!isActive);
  }, [isActive]);

  return {
    show: isModalActive,
    toggleShow: toggleModalActive,
    setMeta,
    ...meta,
  };
};

export default useModal;
