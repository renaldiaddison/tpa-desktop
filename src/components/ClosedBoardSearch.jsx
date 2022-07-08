
import React, { createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const ClosedBoardSearch = ({boardAdmin, boardMember}) => {
    const [boardOption, setBoardboardOption] = useState([]);
    const [boardOptionMember, setBoardOptionMember] = useState([]);
    const [option, setOption] = useState([]);

    const ref = createRef();
    const navigate = useNavigate();

    function handleChange(opt) {
        if (!opt.value) {
            return;
        }
        const link = opt.value;
        navigate(link);
    }


    useEffect(() => {
        setOption([...boardOption, ...boardOptionMember]);

        return () => {
            setOption([]);
        };
    }, [boardOption, boardOptionMember]);

    useEffect(() => {
        if (boardAdmin) {
            let temp = [];
            boardAdmin.map((bo) => {
                const opt = { value: "/home/board/" + bo.id, label: bo.name };
                temp = [...temp, opt];
            });
            setBoardboardOption(temp);
        }
        return () => {
            setBoardboardOption([]);
        };
    }, [boardAdmin]);

    useEffect(() => {
        if (boardMember) {
            let temp = [];
            boardMember.map((bo) => {
                const opt = { value: "/home/board/" + bo.id, label: bo.name };
                temp = [...temp, opt];
            });
            setBoardOptionMember(temp);
        }
        return () => {
            setBoardOptionMember([]);
        };
    }, [boardMember]);

    return (
        <>
            <h1 className="text-xl font-bold mb-3">
                Search Closed Boards!
            </h1>
            <Select
                className="w-96 basic-single"
                classNamePrefix="select"
                name="color"
                options={option}
                ref={ref}
                onChange={handleChange}
            />
        </>
    );
}

export default ClosedBoardSearch