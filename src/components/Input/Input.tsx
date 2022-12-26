import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { setTimeout } from 'timers';
import { IListItem, TActiveInput } from '../App';

interface IInput {
    type: 'add' | 'modi'
    moneyList: IListItem[];
    modiItem?: IListItem;
    setActiveInput: Dispatch<SetStateAction<TActiveInput>>;
    setMoneyList: Dispatch<SetStateAction<IListItem[]>>;
}

function Input(props: IInput) {
    const { type, moneyList, modiItem, setActiveInput, setMoneyList } = props;
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [inputYear, setInputYear] = useState<string>('');
    const [inputMonth, setInputMonth] = useState<string>('');
    const [inputDay, setInputDay] = useState<string>('');
    const [activeInout, setActiveInout] = useState<'none'|'in'|'out'>('none');
    const [inputContent, setInputContent] = useState<string>('');
    const [inputPrice, setInputPrice] = useState<string>('');

    useEffect(() => {
        setTimeout(() => {
            setIsMounted(true);
        }, 150);
        return () => setIsMounted(false);
    }, []);

    useEffect(() => {
        if(type === 'modi' && modiItem) {
            setInputDay(String(modiItem.date));
            setActiveInout(modiItem.inout);
            setInputContent(modiItem.content);
            setInputPrice(String(modiItem.price));
        }
    }, [type, modiItem])

    const action = (type:'add' | 'modi') => {
        if(inputDay === '') {
            alert("날짜를 입력해 주세요.");
        } else if(activeInout === 'none') {
            alert("수입/지출 구분해 주세요.");
        } else if(inputContent === '') {
            alert("내용을 입력해 주세요.");
        } else if(inputPrice === '') {
            alert("금액을 입력해 주세요.");
        } else {
            const newList: IListItem[] = [...moneyList];
            if(type === 'add') {
                let randomId: number = 0;
                while([...moneyList].find(item => item.id === randomId)) {
                    randomId = Math.floor(Math.random() * 100);
                }
                const newItem: IListItem = {
                    id: randomId,
                    date: Number(inputDay),
                    content: inputContent,
                    price: Number(inputPrice),
                    inout: activeInout             
                };
                newList.push(newItem);
            } else if(type === 'modi' && modiItem) {
                const willModiItem = newList.find(item => item.id === modiItem.id);
                if(willModiItem) {
                    willModiItem.date = Number(inputDay);
                    willModiItem.content = inputContent;
                    willModiItem.price = Number(inputPrice);
                    willModiItem.inout = activeInout;
                }
            }
            setMoneyList(newList);
            setActiveInput('');
        }
    }

    return (
        <div className={`input-container ${type} ${isMounted ? "on" : ""}`}>
            <h2 className="title">{`내역 ${type === 'add' ? '추가' : '수정'}`}</h2>
            <dl>
                <dt className="item-title">날짜</dt>
                <dd className="date-input">
                    <input type="number" placeholder="2022" onChange={(e) => setInputYear(e.target.value)}/>
                    <input type="number" placeholder="01" onChange={(e) => setInputMonth(e.target.value)}/>
                    <input type="number" placeholder="01" onChange={(e) => setInputDay(e.target.value)} value={inputDay}/>
                </dd>
            </dl>
            <dl>
                <dt className="item-title">내용</dt>
                <dd className="inout-btns">
                    <button 
                        className={`income ${activeInout === 'in' ? 'active' : ''}`} 
                        onClick={() => setActiveInout('in')}>수입</button>
                    <button 
                        className={`expense ${activeInout === 'out' ? 'active' : ''}`} 
                        onClick={() => setActiveInout('out')}>지출</button>
                </dd>
                <dd>
                    <input 
                        type="text" 
                        className="input-long" 
                        placeholder="내용을 입력해 주세요." 
                        onChange={(e) => setInputContent(e.target.value)}
                        value={inputContent}
                    />
                </dd>
            </dl>
            <dl>
                <dt className="item-title">금액</dt>
                <dd>
                    <input 
                        type="text"
                        className="input-long" 
                        placeholder="금액을 입력해 주세요." 
                        value={Number(inputPrice).toLocaleString()}
                        onChange={(e) => setInputPrice(e.target.value)}
                    />
                </dd>
            </dl>
            <div className="btm-btns">
                <button className="action" onClick={() => action(type)}>{type === 'add' ? '등록' : '수정'}</button>
                <button className="cancel" onClick={() => {setActiveInput('')}}>취소</button>
            </div>
        </div>
    );
}

export default Input;