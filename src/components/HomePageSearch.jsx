
import React, { createRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const HomePageSearch = ({ boardMember, boardAdmin, workspaceAdmin, workspaceMember }) => {

    const [boardOption, setBoardboardOption] = useState([]);
    const [boardOptionMember, setBoardOptionMember] = useState([]);
    const [workspaceOption, setWorkspaceOption] = useState([]);
    const [workspaceOptionMember, setWorkspaceOptionMember] = useState([]);
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
        setOption([...boardOption, ...workspaceOption, ...workspaceOptionMember, ...boardOptionMember]);

        return () => {
            setOption([]);
        };
    }, [boardOption, workspaceOption, workspaceOptionMember, boardOptionMember]);

    useEffect(() => {
        if (workspaceMember) {
            let temp = [];
            workspaceMember.map((bo) => {
                const opt = { value: "/home/workspace/" + bo.id, label: bo.name };
                temp = [...temp, opt];
            });
            setWorkspaceOptionMember(temp);
        }

        return () => {
            setWorkspaceOptionMember([]);
        };
    }, [workspaceMember]);

    useEffect(() => {
        if (workspaceAdmin) {
            let temp = [];
            workspaceAdmin.map((bo) => {
                const opt = { value: "/home/workspace/" + bo.id, label: bo.name };
                temp = [...temp, opt];
            });
            setWorkspaceOption(temp);
        }

        return () => {
            setWorkspaceOption([]);
        };
    }, [workspaceAdmin]);

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
                Search Involved Workspaces & Boards!
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

export default HomePageSearch