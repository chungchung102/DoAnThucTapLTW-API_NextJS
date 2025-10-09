"use client";

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { handleLogout } from '@/api/authApi';
import { logout as logoutAction } from '@/redux/slices/auth.slice';
import { useRouter } from 'next/navigation';
import { CategoryItem, fetchProductCategories } from '@/api/categoryApi';


interface CategoryListProps {
    onCategorySelect: (categoryId: string) => void;
    selectedCategory?: string;
}

export default function CategoryList({ onCategorySelect, selectedCategory }: CategoryListProps) {
    const [categories, setCategories] = useState<CategoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { loggedIn, users } = useSelector((state: RootState) => state.auths);
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const logout = async () => {
        try {
            await handleLogout();
            dispatch(logoutAction());
            router.push('/');
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Logout error:', error);
            dispatch(logoutAction());
            router.push('/');
        }
    };

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const productCategoryIds = ["35279", "35280", "35283", "35285"];
                const filteredCategories = await fetchProductCategories(productCategoryIds);
                setCategories(filteredCategories);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('Lỗi khi tải danh mục:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCats();
    }, []);


    const [showSignin, setShowSignin] = useState(false);

    if (!loggedIn) {
        // Hiển thị form đăng nhập nếu chưa đăng nhập
        return (
            <>
                <LoginForm
                    onClose={() => { }}
                    onShowSignin={() => setShowSignin(true)}
                />
                {showSignin && (
                    <div
                        className="login-modal-overlay"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setShowSignin(false)}
                    >
                        <div
                            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 10000 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <Sigin onClose={() => setShowSignin(false)} />
                        </div>
                    </div>
                )}
            </>
        );
    }

    if (loading) {
        return (
            <></>
        );
    }

    // Hiển thị giao diện mới khi đã đăng nhập
    return (

        <>

            <div className="boxmaster boxmastertinhnangMenu">
                <h4 className="text-primary mb-3">
                    Chào mừng,{" "}
                    <span className="fw-bold text-success">{users?.email || 'Người dùng'}</span>
                </h4>
                <div className="kvmn flex-shrink-0 bg-white grouptinhnangMenu p-3 border rounded">
                    <ul className="list-unstyled ps-0">
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/thong-tin-ca-nhan-cua-ung-vien?id=35063"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Thông tin cá nhân
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/qua-trinh-dao-tao-ung-vien?id=35081"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Quá trình đào tạo
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/kinh-nghiem-ung-vien?id=35082"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Kinh nghiệm
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/ky-nang-khac-cua-ung-vien?id=35083"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Kỹ năng
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/nguon-kiem-tra-xac-minh-ung-vien?id=35084"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Nguồn kiểm tra
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/cv-ca-nhan?id=35062"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                CV cá nhân
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/cong-viec-quan-tam?id=35064"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Công việc quan tâm
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/thong-bao-cong-viec?id=35066"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Thông báo công việc
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/ket-qua-ung-tuyen?id=35065"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Kết quả ứng tuyển
                            </a>
                        </li>
                        <li className="nav-item mb-1 border-bottom">
                            <a
                                href="/ung-vien-doi-mat-khau?id=35067"
                                className="btn btn-toggle align-items-center rounded"
                            >
                                Mật khẩu
                            </a>
                        </li>
                        <li className="nav-item mb-1">
                            <a
                                href="#"
                                className="btn btn-toggle align-items-center rounded logoutbutton"
                                onClick={e => {
                                    e.preventDefault();
                                    logout();
                                }}
                            >
                                Đăng thoát
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
