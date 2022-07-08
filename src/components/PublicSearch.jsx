
import React, { createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const PublicSearch = ({board, workspace}) => {
    const [boardOption, setBoardboardOption] = useState([]);
    const [workspaceOption, setWorkspaceOption] = useState([]);
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
        setOption([...boardOption, ...workspaceOption]);

        return () => {
            setOption([]);
        };
    }, [boardOption, workspaceOption]);


    useEffect(() => {
        if (workspace) {
            let temp = [];
            workspace.map((bo) => {
                const opt = { value: "/home/workspace/" + bo.id, label: bo.name };
                temp = [...temp, opt];
            });
            setWorkspaceOption(temp);
        }

        return () => {
            setWorkspaceOption([]);
        };
    }, [workspace]);

    useEffect(() => {
        if (board) {
            let temp = [];
            board.map((bo) => {
                const opt = { value: "/home/board/" + bo.id, label: bo.name };
                temp = [...temp, opt];
            });
            setBoardboardOption(temp);
        }
        return () => {
            setBoardboardOption([]);
        };
    }, [board]);


    return (
        <>
            <h1 className="text-xl font-bold mb-3">
                Search Public Workspaces & Boards!
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

export default PublicSearch