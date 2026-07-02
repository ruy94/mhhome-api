export interface SpxWardOption {
  level2_id: string;
  name: string;
  type: string;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  codAvailable: boolean;
  status: string;
}

export interface SpxProvinceOption {
  level1_id: string;
  name: string;
  type: string;
  level2s: SpxWardOption[];
}

export const spxServiceArea: SpxProvinceOption[] = [
  {
    "level1_id": "spx-p-2425e7e3c5",
    "name": "Thành phố Cần Thơ",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-3c90e220ff",
        "name": "Phường An Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f654f02235",
        "name": "Phường Bình Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be6dffa393",
        "name": "Phường Cái Khế",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0f529deec5",
        "name": "Phường Cái Răng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9da641844e",
        "name": "Phường Đại Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e4d494315f",
        "name": "Phường Hưng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03260b1d19",
        "name": "Phường Khánh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8f3dd300ea",
        "name": "Phường Long Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-adab8a145f",
        "name": "Phường Long Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dac88110b6",
        "name": "Phường Long Phú 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-49a57976a8",
        "name": "Phường Long Tuyền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0dcda0f436",
        "name": "Phường Mỹ Quới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-33617b4c7b",
        "name": "Phường Mỹ Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-351f4083eb",
        "name": "Phường Ngã Bảy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0f8db69719",
        "name": "Phường Ngã Năm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b56558d836",
        "name": "Phường Ninh Kiều",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b02c8098cc",
        "name": "Phường Ô Môn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b71a1bb7d1",
        "name": "Phường Phú Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-799507ad9c",
        "name": "Phường Phước Thới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b968e463e9",
        "name": "Phường Sóc Trăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bfe84093d5",
        "name": "Phường Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8cfbf4f621",
        "name": "Phường Tân Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db910d7812",
        "name": "Phường Thốt Nốt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d537f7049",
        "name": "Phường Thới An Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2930a5a568",
        "name": "Phường Thới Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9215e00858",
        "name": "Phường Thuận Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-670e573f31",
        "name": "Phường Trung Nhứt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bf59d0e760",
        "name": "Phường Vị Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-37058158c1",
        "name": "Phường Vị Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9009606012",
        "name": "Phường Vĩnh Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-39576ac207",
        "name": "Phường Vĩnh Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f2f7c8638",
        "name": "Xã An Lạc Thôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-670a01bc9a",
        "name": "Xã An Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-563040b3ed",
        "name": "Xã An Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2cc8c07545",
        "name": "Xã Châu Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d87d287c0a",
        "name": "Xã Cờ Đỏ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-abe7a7dd00",
        "name": "Xã Cù Lao Dung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-467c17d23b",
        "name": "Xã Đại Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-62956e17d3",
        "name": "Xã Đại Ngãi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c6b7581bfd",
        "name": "Xã Đông Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9e67945715",
        "name": "Xã Đông Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-34096cd257",
        "name": "Xã Đông Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-44549d28c1",
        "name": "Xã Gia Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fe51ca3be5",
        "name": "Xã Hiệp Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1b177adde4",
        "name": "Xã Hòa An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-997f6e94a6",
        "name": "Xã Hỏa Lựu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83c1292cb1",
        "name": "Xã Hòa Tú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e18ede4c5b",
        "name": "Xã Hồ Đắc Kiện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb051abdbe",
        "name": "Xã Kế Sách",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60fd9bace4",
        "name": "Xã Lai Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-44ba5c7eec",
        "name": "Xã Lâm Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85fc6c5468",
        "name": "Xã Lịch Hội Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-280e694b06",
        "name": "Xã Liêu Tú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4a2506b38a",
        "name": "Xã Long Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-41f672f47d",
        "name": "Xã Long Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-379ca634cb",
        "name": "Xã Lương Tâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-acc010b1ce",
        "name": "Xã Mỹ Hương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c4ea50eb7f",
        "name": "Xã Mỹ Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-521aebac35",
        "name": "Xã Mỹ Tú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e69a6ec6c7",
        "name": "Xã Ngọc Tố",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1127eef768",
        "name": "Xã Nhơn Ái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b293122759",
        "name": "Xã Nhơn Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-324b54f5ae",
        "name": "Xã Nhu Gia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa07019b6f",
        "name": "Xã Phong Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b81816fcf0",
        "name": "Xã Phong Nẫm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a3391db72",
        "name": "Xã Phú Hữu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8361b483c5",
        "name": "Xã Phú Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5945128fa1",
        "name": "Xã Phú Tâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-995c816aea",
        "name": "Xã Phụng Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-008f1a37d6",
        "name": "Xã Phương Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6ff6cf8f3e",
        "name": "Xã Tài Văn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc10435925",
        "name": "Xã Tân Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cec44a0b41",
        "name": "Xã Tân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-065b75b4fe",
        "name": "Xã Tân Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ced9220c7e",
        "name": "Xã Tân Phước Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ca308ea5f",
        "name": "Xã Tân Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dee21b35d5",
        "name": "Xã Thạnh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d4f0fd02fa",
        "name": "Xã Thạnh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e12f3cd23",
        "name": "Xã Thạnh Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-163e523d36",
        "name": "Xã Thạnh Quới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67c2be44c8",
        "name": "Xã Thạnh Thới An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f1a4d5e38",
        "name": "Xã Thạnh Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-354d5118bb",
        "name": "Xã Thới An Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e01558bf3",
        "name": "Xã Thới Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc8964cd16",
        "name": "Xã Thới Lai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-800e42e694",
        "name": "Xã Thuận Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f67dc4390e",
        "name": "Xã Trần Đề",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-988c5c967d",
        "name": "Xã Trung Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-feab09f764",
        "name": "Xã Trường Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c8d1c243a3",
        "name": "Xã Trường Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3bb7128357",
        "name": "Xã Trường Long Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-51234c88e7",
        "name": "Xã Trường Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bfad11399e",
        "name": "Xã Trường Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8d2f5c8b3d",
        "name": "Xã Vị Thanh 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-47ec02719d",
        "name": "Xã Vị Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f46c3a1612",
        "name": "Xã Vĩnh Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f42c798c76",
        "name": "Xã Vĩnh Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-77a9528887",
        "name": "Xã Vĩnh Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf2cd71bf6",
        "name": "Xã Vĩnh Thuận Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8d37722668",
        "name": "Xã Vĩnh Trinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed0016bd59",
        "name": "Xã Vĩnh Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc8817c365",
        "name": "Xã Vĩnh Viễn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be4c0a374b",
        "name": "Xã Xà Phiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-3f8fbbadee",
    "name": "Thành phố Đà Nẵng",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-2cbaf2b302",
        "name": "Đặc khu Hoàng Sa",
        "type": "",
        "deliveryAvailable": false,
        "pickupAvailable": false,
        "codAvailable": false,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-38e03d7254",
        "name": "Phường An Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-71b1ae3279",
        "name": "Phường An Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e74cd0db2b",
        "name": "Phường An Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c060931638",
        "name": "Phường Bàn Thạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca84469c48",
        "name": "Phường Cẩm Lệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0bbc42689f",
        "name": "Phường Điện Bàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5bfc894c48",
        "name": "Phường Điện Bàn Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cbe1b57111",
        "name": "Phường Điện Bàn Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-44f3c63e46",
        "name": "Phường Hải Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4892ce9453",
        "name": "Phường Hải Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1aa3a4c801",
        "name": "Phường Hòa Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae267d36ce",
        "name": "Phường Hòa Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fdc4fb8df7",
        "name": "Phường Hòa Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-74c1125a5a",
        "name": "Phường Hội An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1d9d95f4bc",
        "name": "Phường Hội An Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e4c091d723",
        "name": "Phường Hội An Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7c9eec6dc",
        "name": "Phường Hương Trà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28869cc1dd",
        "name": "Phường Liên Chiểu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-37736f2ab7",
        "name": "Phường Ngũ Hành Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-450175e2a8",
        "name": "Phường Quảng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a5ceac4c82",
        "name": "Phường Sơn Trà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0bc1e11ce1",
        "name": "Phường Tam Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-de3907a18e",
        "name": "Phường Thanh Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4dd7fa7c20",
        "name": "Xã Avương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-158387ce19",
        "name": "Xã Bà Nà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4be5da9b38",
        "name": "Xã Bến Giằng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-055ac800ed",
        "name": "Xã Bến Hiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b0404c4465",
        "name": "Xã Chiên Đàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7b3fe6dfbb",
        "name": "Xã Duy Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23a4e890cc",
        "name": "Xã Duy Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b138e499c",
        "name": "Xã Đại Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f13a07ad99",
        "name": "Xã Đắc Pring",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-01c6ea6850",
        "name": "Xã Điện Bàn Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b9cc35249",
        "name": "Xã Đồng Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-11d5fc9fa0",
        "name": "Xã Đông Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2239fdb8c1",
        "name": "Xã Đức Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-31a7b9ad91",
        "name": "Xã Gò Nổi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-112a931a0e",
        "name": "Xã Hà Nha",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b091c95eb",
        "name": "Xã Hiệp Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2db9cfb2f",
        "name": "Xã Hòa Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae5ba70a1c",
        "name": "Xã Hòa Vang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5a7234e620",
        "name": "Xã Hùng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8f116c8b3f",
        "name": "Xã Khâm Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e23db4f985",
        "name": "Xã La Dêê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e1f95cf348",
        "name": "Xã La Êê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7b3540a8e1",
        "name": "Xã Lãnh Ngọc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff9baeb6b0",
        "name": "Xã Nam Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-80fe3fb2f5",
        "name": "Xã Nam Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-557c3e0b7e",
        "name": "Xã Nam Trà My",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2c1cbcc4c",
        "name": "Xã Nông Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c97056268",
        "name": "Xã Núi Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fced265350",
        "name": "Xã Phú Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e3b82a2d54",
        "name": "Xã Phú Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b52e4c038d",
        "name": "Xã Phước Chánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-590a126065",
        "name": "Xã Phước Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3473262a76",
        "name": "Xã Phước Năng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-46cca8f389",
        "name": "Xã Phước Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab2ba1ae9d",
        "name": "Xã Phước Trà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e5504c016",
        "name": "Xã Quế Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d1fb02cbf",
        "name": "Xã Quế Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ceb093df70",
        "name": "Xã Quế Sơn Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1188705bef",
        "name": "Xã Sông Kôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e3cbf1579",
        "name": "Xã Sông Vàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-997fe05e69",
        "name": "Xã Sơn Cẩm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-767b4e5669",
        "name": "Xã Tam Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a08d628ac",
        "name": "Xã Tam Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d402a7718",
        "name": "Xã Tam Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c02cdbfcd",
        "name": "Xã Tam Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bfa68d3371",
        "name": "Xã Tân Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3499187d83",
        "name": "Xã Tây Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae3c7bc579",
        "name": "Xã Tây Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b64f21512",
        "name": "Xã Thạnh Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4560f02eb7",
        "name": "Xã Thạnh Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7882ce8173",
        "name": "Xã Thăng An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-453240e2d7",
        "name": "Xã Thăng Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-864c687317",
        "name": "Xã Thăng Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a4d4079780",
        "name": "Xã Thăng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c6e13a549",
        "name": "Xã Thăng Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f7a931573",
        "name": "Xã Thu Bồn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac20666e83",
        "name": "Xã Thượng Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e90b6832e9",
        "name": "Xã Tiên Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9b0522b417",
        "name": "Xã Trà Đốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc4f08b686",
        "name": "Xã Trà Giáp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c7a62e9de",
        "name": "Xã Trà Leng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ffbb153501",
        "name": "Xã Trà Liên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-59ca57c159",
        "name": "Xã Trà Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-890d02c1a3",
        "name": "Xã Trà My",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cb60012f4b",
        "name": "Xã Trà Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4370812092",
        "name": "Xã Trà Tập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9913339c3f",
        "name": "Xã Trà Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-88e3614381",
        "name": "Xã Việt An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0926e0e169",
        "name": "Xã Vu Gia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e02c56f77",
        "name": "Xã Xuân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-43e96a5286",
    "name": "Thành phố Hà Nội",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-ad98e00bf6",
        "name": "Phường Ba Đình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f31da1881",
        "name": "Phường Bạch Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a58e033349",
        "name": "Phường Bồ Đề",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-94705dd5d7",
        "name": "Phường Cầu Giấy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e2dc4f0653",
        "name": "Phường Chương Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d60333f47d",
        "name": "Phường Cửa Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23ab5538cf",
        "name": "Phường Dương Nội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db29b67349",
        "name": "Phường Đại Mỗ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-59b67df719",
        "name": "Phường Định Công",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0e11531159",
        "name": "Phường Đống Đa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-55f1a1c3d2",
        "name": "Phường Đông Ngạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e38ceb4a31",
        "name": "Phường Giảng Võ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a638534a3c",
        "name": "Phường Hà Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9cd436531e",
        "name": "Phường Hai Bà Trưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ec7aab511e",
        "name": "Phường Hoàn Kiếm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a01114a31",
        "name": "Phường Hoàng Liệt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23cf31bbca",
        "name": "Phường Hoàng Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e87570bf9",
        "name": "Phường Hồng Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ddd46d813",
        "name": "Phường Khương Đình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c75412d2e",
        "name": "Phường Kiến Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-907a174235",
        "name": "Phường Kim Liên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f4b0514cea",
        "name": "Phường Láng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-732fd784be",
        "name": "Phường Lĩnh Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-68d3ef1e01",
        "name": "Phường Long Biên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-13d0f2b7e2",
        "name": "Phường Nghĩa Đô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87eac7ced4",
        "name": "Phường Ngọc Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c9fcefebc4",
        "name": "Phường Ô Chợ Dừa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7db3f5d48",
        "name": "Phường Phú Diễn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb2f19aa97",
        "name": "Phường Phú Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-534ab5021d",
        "name": "Phường Phú Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc91e782a4",
        "name": "Phường Phúc Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3f863c0e61",
        "name": "Phường Phương Liệt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-97cb660b4b",
        "name": "Phường Sơn Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a60eeec29",
        "name": "Phường Tây Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1373d4558",
        "name": "Phường Tây Mỗ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-efaf65f933",
        "name": "Phường Tây Tựu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6753dd072",
        "name": "Phường Thanh Liệt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-823b19e1c2",
        "name": "Phường Thanh Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d4a8638535",
        "name": "Phường Thượng Cát",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-79c08306fa",
        "name": "Phường Tùng Thiện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e38737a4d5",
        "name": "Phường Từ Liêm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d722fd035e",
        "name": "Phường Tương Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-54d255dfd9",
        "name": "Phường Văn Miếu - Quốc Tử Giám",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dad158acef",
        "name": "Phường Việt Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e8f778cc2",
        "name": "Phường Vĩnh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c502c988bb",
        "name": "Phường Vĩnh Tuy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-04c1c9dd89",
        "name": "Phường Xuân Đỉnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-937fa465cb",
        "name": "Phường Xuân Phương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1aa0f17178",
        "name": "Phường Yên Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d63c6841d2",
        "name": "Phường Yên Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-daf91e12cd",
        "name": "Phường Yên Sở",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d3036d372f",
        "name": "Xã An Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3478cf7031",
        "name": "Xã Ba Vì",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-12357038b1",
        "name": "Xã Bát Tràng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f1d1c13c71",
        "name": "Xã Bất Bạt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9fe820f332",
        "name": "Xã Bình Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67efbac261",
        "name": "Xã Chuyên Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf058adbac",
        "name": "Xã Chương Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-89e6f7c1ce",
        "name": "Xã Cổ Đô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-064461be0c",
        "name": "Xã Dân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a383a67d6",
        "name": "Xã Dương Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-72e622e62f",
        "name": "Xã Đa Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-644772b2ef",
        "name": "Xã Đại Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-31ff95a182",
        "name": "Xã Đại Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc826dbed2",
        "name": "Xã Đan Phượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c249e0b592",
        "name": "Xã Đoài Phương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ec8b6bf5c",
        "name": "Xã Đông Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f4ac5714dd",
        "name": "Xã Gia Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-101c357562",
        "name": "Xã Hạ Bằng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ce3792bb69",
        "name": "Xã Hát Môn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1628e71ef6",
        "name": "Xã Hòa Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c46b9c8e6",
        "name": "Xã Hòa Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-517a30fccb",
        "name": "Xã Hòa Xá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-716f4178ad",
        "name": "Xã Hoài Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d6a554d5df",
        "name": "Xã Hồng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b77ba66f27",
        "name": "Xã Hồng Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7602f61d2",
        "name": "Xã Hưng Đạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96f5653bb3",
        "name": "Xã Hương Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e591b579ee",
        "name": "Xã Kiều Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a57ebc7bab",
        "name": "Xã Kim Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85cc1ae1dc",
        "name": "Xã Liên Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3be7aafbdc",
        "name": "Xã Mê Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c4f300096",
        "name": "Xã Minh Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a98bfd451",
        "name": "Xã Mỹ Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-280bfb1719",
        "name": "Xã Nam Phù",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-82389eba62",
        "name": "Xã Ngọc Hồi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a2557c4b4a",
        "name": "Xã Nội Bài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-de10be116f",
        "name": "Xã Ô Diên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2f5da1014c",
        "name": "Xã Phú Cát",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-82af2e2294",
        "name": "Xã Phù Đổng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-da94798820",
        "name": "Xã Phú Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9dcd346e61",
        "name": "Xã Phú Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a07793dc2",
        "name": "Xã Phúc Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-815926b660",
        "name": "Xã Phúc Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-df802eec32",
        "name": "Xã Phúc Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-597b2c7972",
        "name": "Xã Phúc Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7850d51ca1",
        "name": "Xã Phượng Dực",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1814ae6287",
        "name": "Xã Quảng Bị",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27aca72f91",
        "name": "Xã Quang Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-17a4fc26af",
        "name": "Xã Quảng Oai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-44d7caacdd",
        "name": "Xã Quốc Oai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab16343fae",
        "name": "Xã Sóc Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0cfa7da7fa",
        "name": "Xã Sơn Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e2ee120496",
        "name": "Xã Suối Hai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cfc640912d",
        "name": "Xã Tam Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-960bb69c89",
        "name": "Xã Tây Phương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8c83529ca8",
        "name": "Xã Thạch Thất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b24b45b127",
        "name": "Xã Thanh Oai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-92af08edd1",
        "name": "Xã Thanh Trì",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-61900b1ebd",
        "name": "Xã Thiên Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-104b310e63",
        "name": "Xã Thuận An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7db578026f",
        "name": "Xã Thư Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-29294d1bb6",
        "name": "Xã Thượng Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ac525c1c8",
        "name": "Xã Thường Tín",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60069f762e",
        "name": "Xã Tiến Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c50e68b5b",
        "name": "Xã Trần Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-94b1bad8d7",
        "name": "Xã Trung Giã",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d7ed784193",
        "name": "Xã Ứng Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2bdf2b52fa",
        "name": "Xã Ứng Thiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f5be7fc07c",
        "name": "Xã Vân Đình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9870246ecd",
        "name": "Xã Vật Lại",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83813b9510",
        "name": "Xã Vĩnh Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c61f789a87",
        "name": "Xã Xuân Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8de7fdf443",
        "name": "Xã Yên Bài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-114f8f2e23",
        "name": "Xã Yên Lãng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84e814876b",
        "name": "Xã Yên Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-89d72672a4",
    "name": "Thành phố Hải Phòng",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-db16b19b3d",
        "name": "Đặc khu Bạch Long Vĩ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-05d2dfb235",
        "name": "Đặc khu Cát Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-803e80ae50",
        "name": "Phường Ái Quốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-070375d2ae",
        "name": "Phường An Biên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60020733d1",
        "name": "Phường An Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c611d0f9ef",
        "name": "Phường An Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b8ef50c302",
        "name": "Phường An Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2dee850bdb",
        "name": "Phường Bạch Đằng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ccc3a181a5",
        "name": "Phường Bắc An Phụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-142188e930",
        "name": "Phường Chí Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-436f1b7800",
        "name": "Phường Chu Văn An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8dcbce31a0",
        "name": "Phường Dương Kinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-750a4816e4",
        "name": "Phường Đồ Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-471a386990",
        "name": "Phường Đông Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3fc4315ab5",
        "name": "Phường Gia Viên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-97e5d42713",
        "name": "Phường Hải An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c7ce96ce5c",
        "name": "Phường Hải Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2327e2e2a2",
        "name": "Phường Hòa Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d9eb9859f8",
        "name": "Phường Hồng An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f462e34dc5",
        "name": "Phường Hồng Bàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2874547d13",
        "name": "Phường Hưng Đạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4aaf50849e",
        "name": "Phường Kiến An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d7e1cf6356",
        "name": "Phường Kinh Môn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e737a2ac66",
        "name": "Phường Lê Chân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5ccfc7457c",
        "name": "Phường Lê Đại Hành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0db2c936e0",
        "name": "Phường Lê Ích Mộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-539127a6c1",
        "name": "Phường Lê Thanh Nghị",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-63c1bf8fb2",
        "name": "Phường Lưu Kiếm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e36d5e7cac",
        "name": "Phường Nam Đồ Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1201fbde11",
        "name": "Phường Nam Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b029d30859",
        "name": "Phường Nam Triệu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4cabf8e93a",
        "name": "Phường Ngô Quyền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a79fdaaca2",
        "name": "Phường Nguyễn Đại Năng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85e9b6bc08",
        "name": "Phường Nguyễn Trãi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a96084234",
        "name": "Phường Nhị Chiểu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-562676df8d",
        "name": "Phường Phạm Sư Mạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7593ff83be",
        "name": "Phường Phù Liễn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84ba78a151",
        "name": "Phường Tân Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-04c9a992a8",
        "name": "Phường Thạch Khôi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7799e061fc",
        "name": "Phường Thành Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27e1e231d8",
        "name": "Phường Thiên Hương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a3e1bbca06",
        "name": "Phường Thủy Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5eccd4e664",
        "name": "Phường Trần Hưng Đạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-adedc84cb6",
        "name": "Phường Trần Liễu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cde26beed6",
        "name": "Phường Trần Nhân Tông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6d20060c9b",
        "name": "Phường Tứ Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b2b6ea2868",
        "name": "Phường Việt Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e34b6a8d8",
        "name": "Xã An Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ccc24b9436",
        "name": "Xã An Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-74e20b082f",
        "name": "Xã An Lão",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4370403663",
        "name": "Xã An Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b178220e2e",
        "name": "Xã An Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f29004eb5",
        "name": "Xã An Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03afd2efcf",
        "name": "Xã An Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-191c14da95",
        "name": "Xã Bắc Thanh Miện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed58e1102f",
        "name": "Xã Bình Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76dbd13f34",
        "name": "Xã Cẩm Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e2615e167",
        "name": "Xã Cẩm Giàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b909b6f98",
        "name": "Xã Chấn Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eeeeb29b69",
        "name": "Xã Chí Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-426fa209d9",
        "name": "Xã Đại Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd173ec8ec",
        "name": "Xã Đường An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c63e061235",
        "name": "Xã Gia Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c867b00f1",
        "name": "Xã Gia Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c4f08406df",
        "name": "Xã Hà Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c8f1933af9",
        "name": "Xã Hà Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b40c1864d",
        "name": "Xã Hà Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ac80c13c7",
        "name": "Xã Hà Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd104caa6d",
        "name": "Xã Hải Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ab8baaedc",
        "name": "Xã Hồng Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-16f5c6e2df",
        "name": "Xã Hợp Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60c281c79b",
        "name": "Xã Hùng Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-014b7194f6",
        "name": "Xã Kẻ Sặt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-71f04b4fff",
        "name": "Xã Khúc Thừa Dụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27640e67c6",
        "name": "Xã Kiến Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20e10cdbdc",
        "name": "Xã Kiến Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2cf53cc4a8",
        "name": "Xã Kiến Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc071196db",
        "name": "Xã Kiến Thụy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-516812e8c5",
        "name": "Xã Kim Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f91d4218b7",
        "name": "Xã Lạc Phượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-80027e698a",
        "name": "Xã Lai Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5ba34bb83d",
        "name": "Xã Mao Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-606441d950",
        "name": "Xã Nam An Phụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50d65064df",
        "name": "Xã Nam Sách",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c14cfd60cd",
        "name": "Xã Nam Thanh Miện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f357bc17d",
        "name": "Xã Nghi Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7735a6532",
        "name": "Xã Nguyễn Bỉnh Khiêm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8f576473e0",
        "name": "Xã Nguyên Giáp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f9b07d695e",
        "name": "Xã Nguyễn Lương Bằng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-647fec8a53",
        "name": "Xã Ninh Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bd77940647",
        "name": "Xã Phú Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e561a9979",
        "name": "Xã Quyết Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c24c8f6764",
        "name": "Xã Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-469a56948a",
        "name": "Xã Tân Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c23c8eff6",
        "name": "Xã Tân Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-087301552e",
        "name": "Xã Thái Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-972adf1c08",
        "name": "Xã Thanh Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-232cc64579",
        "name": "Xã Thanh Miện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cbbd4746d0",
        "name": "Xã Thượng Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8bcfc39dd0",
        "name": "Xã Tiên Lãng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ed15607a5",
        "name": "Xã Tiên Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-da5a2d4a3f",
        "name": "Xã Trần Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-29366f0c0b",
        "name": "Xã Trường Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64c72a7407",
        "name": "Xã Tuệ Tĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1c872332a2",
        "name": "Xã Tứ Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6abc72404",
        "name": "Xã Việt Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f618330445",
        "name": "Xã Vĩnh Am",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b4fa60cbcb",
        "name": "Xã Vĩnh Bảo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b800314342",
        "name": "Xã Vĩnh Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-13470877e4",
        "name": "Xã Vĩnh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8998d4f3ce",
        "name": "Xã Vĩnh Lại",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c8d5d615f",
        "name": "Xã Vĩnh Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60d99aca4e",
        "name": "Xã Vĩnh Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be8b475f86",
        "name": "Xã Yết Kiêu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-e04dc0ba0a",
    "name": "Thành phố Hồ Chí Minh",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-5725879fdc",
        "name": "Đặc khu Côn Đảo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bcd8f4d557",
        "name": "Phường An Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-513bfde4e8",
        "name": "Phường An Hội Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-78041065e1",
        "name": "Phường An Hội Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-37bdfc857c",
        "name": "Phường An Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-02a4ac7b75",
        "name": "Phường An Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e8d563ff3",
        "name": "Phường An Nhơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be9c1f3fe0",
        "name": "Phường An Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f31e8ec6d",
        "name": "Phường An Phú Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e5c9d677ec",
        "name": "Phường Bà Rịa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-691fda4a11",
        "name": "Phường Bàn Cờ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-82edd0457e",
        "name": "Phường Bảy Hiền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bcde056d86",
        "name": "Phường Bến Cát",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2b5dd60ab",
        "name": "Phường Bến Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-729608f9ea",
        "name": "Phường Bình Cơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab438a21c5",
        "name": "Phường Bình Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b653b7cea2",
        "name": "Phường Bình Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c2fc7c28c",
        "name": "Phường Bình Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d3f5b52e29",
        "name": "Phường Bình Hưng Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-02d14c69b7",
        "name": "Phường Bình Lợi Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1799ceb43f",
        "name": "Phường Bình Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-55e8bdfdfc",
        "name": "Phường Bình Quới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-927e2c9aec",
        "name": "Phường Bình Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-26c31451b2",
        "name": "Phường Bình Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-acc3327473",
        "name": "Phường Bình Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c738da695",
        "name": "Phường Bình Thới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b7c8be7ef6",
        "name": "Phường Bình Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff232dcb1d",
        "name": "Phường Bình Trị Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8098c143d0",
        "name": "Phường Bình Trưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ca22761a9",
        "name": "Phường Cát Lái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-45e4b2d4b4",
        "name": "Phường Cầu Kiệu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-95088bc6ca",
        "name": "Phường Cầu Ông Lãnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d152a6b2c0",
        "name": "Phường Chánh Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7661ee4eb4",
        "name": "Phường Chánh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4645e1dda9",
        "name": "Phường Chánh Phú Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-489b9198db",
        "name": "Phường Chợ Lớn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1198381c5c",
        "name": "Phường Chợ Quán",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-56c8a05eb6",
        "name": "Phường Dĩ An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eca33782d3",
        "name": "Phường Diên Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-329f4d4bad",
        "name": "Phường Đông Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-02b56f5ba3",
        "name": "Phường Đông Hưng Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15d1116a12",
        "name": "Phường Đức Nhuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8fa7c706e8",
        "name": "Phường Gia Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7172e1ea6b",
        "name": "Phường Gò Vấp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc095525ca",
        "name": "Phường Hạnh Thông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-afc4322080",
        "name": "Phường Hiệp Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f765610b9f",
        "name": "Phường Hòa Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f668eaf32f",
        "name": "Phường Hòa Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d02a9afa99",
        "name": "Phường Hòa Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3009fdfbb4",
        "name": "Phường Khánh Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0416614fe0",
        "name": "Phường Lái Thiêu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-193fa25e35",
        "name": "Phường Linh Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5a23387dc2",
        "name": "Phường Long Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ce29fb5f0",
        "name": "Phường Long Hương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-63640c27ba",
        "name": "Phường Long Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e319533529",
        "name": "Phường Long Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-118113c857",
        "name": "Phường Long Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-718b83a3ec",
        "name": "Phường Minh Phụng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f62274935f",
        "name": "Phường Nhiêu Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6924ae672",
        "name": "Phường Phú An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-713eb61ce6",
        "name": "Phường Phú Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7807002ad0",
        "name": "Phường Phú Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7c16bbbc97",
        "name": "Phường Phú Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c7a8b3fb71",
        "name": "Phường Phú Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bd9e6bb60f",
        "name": "Phường Phú Nhuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bf151c58c3",
        "name": "Phường Phú Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e97815c6bd",
        "name": "Phường Phú Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5cd29b3f64",
        "name": "Phường Phú Thọ Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ae8684e00",
        "name": "Phường Phú Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-548a0da556",
        "name": "Phường Phước Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60d16dab3d",
        "name": "Phường Phước Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23ae3a3a15",
        "name": "Phường Rạch Dừa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ac5d627d9",
        "name": "Phường Sài Gòn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d4c23fb986",
        "name": "Phường Tam Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f5de4b3b84",
        "name": "Phường Tam Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3afd8fd24a",
        "name": "Phường Tam Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6e193cc73",
        "name": "Phường Tăng Nhơn Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d05aa84392",
        "name": "Phường Tân Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f77674e449",
        "name": "Phường Tân Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e377fd5c5e",
        "name": "Phường Tân Đông Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-969e40af46",
        "name": "Phường Tân Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8124a66dc8",
        "name": "Phường Tân Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-995585df55",
        "name": "Phường Tân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ec5ffb84d",
        "name": "Phường Tân Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-938432ff44",
        "name": "Phường Tân Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b8a601977e",
        "name": "Phường Tân Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff3b485aba",
        "name": "Phường Tân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00555ed6a6",
        "name": "Phường Tân Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1396538993",
        "name": "Phường Tân Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7cfb46981a",
        "name": "Phường Tân Sơn Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96b2344694",
        "name": "Phường Tân Sơn Nhất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fd72181d08",
        "name": "Phường Tân Sơn Nhì",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad024d88fe",
        "name": "Phường Tân Tạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-caccb5f34e",
        "name": "Phường Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f3612f90e",
        "name": "Phường Tân Thới Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e668bad2d",
        "name": "Phường Tân Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a9ee6873e9",
        "name": "Phường Tân Uyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ba3881a89",
        "name": "Phường Tây Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-459509d028",
        "name": "Phường Tây Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a52fde0e26",
        "name": "Phường Thạnh Mỹ Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0b8851a871",
        "name": "Phường Thông Tây Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a2461ee2e1",
        "name": "Phường Thới An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad3164b323",
        "name": "Phường Thới Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c4ffb4ae38",
        "name": "Phường Thủ Dầu Một",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-405450df63",
        "name": "Phường Thủ Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ccc19494e",
        "name": "Phường Thuận An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99c8a0e67f",
        "name": "Phường Thuận Giao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-95c83470a1",
        "name": "Phường Trung Mỹ Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-adacb97829",
        "name": "Phường Vĩnh Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96df8617b6",
        "name": "Phường Vĩnh Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d907f2dedb",
        "name": "Phường Vũng Tàu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6dc9eaccc2",
        "name": "Phường Vườn Lài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-746a32e7d3",
        "name": "Phường Xóm Chiếu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa984739e2",
        "name": "Phường Xuân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e71b499f9d",
        "name": "Xã An Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c66064d97b",
        "name": "Xã An Nhơn Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9b1d539e20",
        "name": "Xã An Thới Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb0708a266",
        "name": "Xã Bà Điểm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e88b53da87",
        "name": "Xã Bàu Bàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a67f678ab",
        "name": "Xã Bàu Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-800eece213",
        "name": "Xã Bắc Tân Uyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1c84d87ca6",
        "name": "Xã Bình Chánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a2f60f12ed",
        "name": "Xã Bình Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d586bdb8b",
        "name": "Xã Bình Giã",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a8df14ca20",
        "name": "Xã Bình Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-243d1609e9",
        "name": "Xã Bình Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c56aef04a5",
        "name": "Xã Bình Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d04ad9115",
        "name": "Xã Bình Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8dcb1bad5e",
        "name": "Xã Cần Giờ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f61b83cb14",
        "name": "Xã Châu Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8dd62d0ecb",
        "name": "Xã Châu Pha",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ebe91c8f1a",
        "name": "Xã Củ Chi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-427dfa56b6",
        "name": "Xã Dầu Tiếng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b897cd88a5",
        "name": "Xã Đất Đỏ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3be1171e44",
        "name": "Xã Đông Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a972f7b4d3",
        "name": "Xã Hiệp Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d6d578f760",
        "name": "Xã Hòa Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cb7a7e96a0",
        "name": "Xã Hòa Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cdc522668b",
        "name": "Xã Hóc Môn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1592cfce74",
        "name": "Xã Hồ Tràm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bde05db2ef",
        "name": "Xã Hưng Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f7b7d988b",
        "name": "Xã Kim Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8a98884b02",
        "name": "Xã Long Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c490580763",
        "name": "Xã Long Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a9a6694ac9",
        "name": "Xã Long Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1c694ca6fa",
        "name": "Xã Long Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f66955e7a9",
        "name": "Xã Minh Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc3b4688a7",
        "name": "Xã Ngãi Giao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fcf7ae3024",
        "name": "Xã Nghĩa Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ecd66474cc",
        "name": "Xã Nhà Bè",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-467982e1e7",
        "name": "Xã Nhuận Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5b63ebe852",
        "name": "Xã Phú Giáo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-923e5c342c",
        "name": "Xã Phú Hòa Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f65d00f402",
        "name": "Xã Phước Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-998f47463e",
        "name": "Xã Phước Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8fe4ee799c",
        "name": "Xã Phước Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9e45012c87",
        "name": "Xã Tân An Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b50dd7288e",
        "name": "Xã Tân Nhựt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e00a2117b5",
        "name": "Xã Tân Vĩnh Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ef85a5b126",
        "name": "Xã Thái Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b8e1f4ed2",
        "name": "Xã Thanh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9b26c6792c",
        "name": "Xã Thạnh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8934103225",
        "name": "Xã Thường Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a71f55be3d",
        "name": "Xã Trừ Văn Thố",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5155e5bfc1",
        "name": "Xã Vĩnh Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9f70b612a",
        "name": "Xã Xuân Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-942fdf7790",
        "name": "Xã Xuân Thới Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7886fd831f",
        "name": "Xã Xuyên Mộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-a1a3f98a08",
    "name": "Thành phố Huế",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-529e332031",
        "name": "Phường An Cựu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5349665228",
        "name": "Phường Dương Nỗ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e4e4a155a7",
        "name": "Phường Hóa Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-778b09b130",
        "name": "Phường Hương An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28d658a935",
        "name": "Phường Hương Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f272aec9d7",
        "name": "Phường Hương Trà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5a019c41f5",
        "name": "Phường Kim Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d263912c4",
        "name": "Phường Kim Trà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-42438fc543",
        "name": "Phường Mỹ Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a0a30336c",
        "name": "Phường Phong Dinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d528379d05",
        "name": "Phường Phong Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27116807aa",
        "name": "Phường Phong Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c8a53fee71",
        "name": "Phường Phong Quảng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-14df820fbd",
        "name": "Phường Phong Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-049b3e3ee0",
        "name": "Phường Phú Bài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7b430d3b88",
        "name": "Phường Phú Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d75606f563",
        "name": "Phường Thanh Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a6b42ac935",
        "name": "Phường Thuận An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-79b90f86e4",
        "name": "Phường Thuận Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e2b6d1e15",
        "name": "Phường Thủy Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8910721401",
        "name": "Phường Vỹ Dạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc50e54c81",
        "name": "Xã A Lưới 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f34f14ece5",
        "name": "Xã A Lưới 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-578c20a3f1",
        "name": "Xã A Lưới 3",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5fb86bf456",
        "name": "Xã A Lưới 4",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bfb26bca6c",
        "name": "Xã A Lưới 5",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-312c5529be",
        "name": "Xã Bình Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c0164752b7",
        "name": "Xã Chân Mây - Lăng Cô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-08f8bf6399",
        "name": "Xã Đan Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-893f0af371",
        "name": "Xã Hưng Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2220cb41db",
        "name": "Xã Khe Tre",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8b3bd4d0a0",
        "name": "Xã Long Quảng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fc57c464e0",
        "name": "Xã Lộc An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c3cddfc59",
        "name": "Xã Nam Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-05a3549323",
        "name": "Xã Phú Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab4d845d37",
        "name": "Xã Phú Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-98ce0644d6",
        "name": "Xã Phú Vang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2da7ab43a",
        "name": "Xã Phú Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6aba9721db",
        "name": "Xã Quảng Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-94740ec941",
        "name": "Xã Vinh Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-1ea82d500d",
    "name": "Tỉnh An Giang",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-cf03946730",
        "name": "Đặc khu Kiên Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2840a3259a",
        "name": "Đặc khu Phú Quốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad70f50cd2",
        "name": "Đặc khu Thổ Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-402ec58e30",
        "name": "Phường Bình Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ed23dca05",
        "name": "Phường Châu Đốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-44c8652716",
        "name": "Phường Chi Lăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-959f837c34",
        "name": "Phường Hà Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2051e61c6c",
        "name": "Phường Long Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f39d1efb1f",
        "name": "Phường Long Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f0d916bb8",
        "name": "Phường Mỹ Thới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a3dc2035a",
        "name": "Phường Rạch Giá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-65f8f98074",
        "name": "Phường Tân Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7858ff272d",
        "name": "Phường Thới Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f6de6c776",
        "name": "Phường Tịnh Biên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d22b264663",
        "name": "Phường Tô Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eb7d3171aa",
        "name": "Phường Vĩnh Tế",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7fdbdf5f68",
        "name": "Phường Vĩnh Thông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d13315c339",
        "name": "Xã An Biên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e0be570fcb",
        "name": "Xã An Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e9e4eabd7",
        "name": "Xã An Cư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fdaa953996",
        "name": "Xã An Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e5171e501",
        "name": "Xã An Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84fd1ebadf",
        "name": "Xã Ba Chúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa382fcbd0",
        "name": "Xã Bình An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60b2b0ec9b",
        "name": "Xã Bình Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-88023edeca",
        "name": "Xã Bình Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b74f1464e3",
        "name": "Xã Bình Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-55bc077129",
        "name": "Xã Bình Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-262caa72d8",
        "name": "Xã Bình Thạnh Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96f9ac6c5c",
        "name": "Xã Cần Đăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ec2c2432b8",
        "name": "Xã Châu Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b0cebf6a21",
        "name": "Xã Châu Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-94719813b1",
        "name": "Xã Châu Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e651188f72",
        "name": "Xã Chợ Mới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8b41feafc6",
        "name": "Xã Chợ Vàm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b8f3cb001c",
        "name": "Xã Cô Tô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d80e2eaca1",
        "name": "Xã Cù Lao Giêng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-df692cb173",
        "name": "Xã Định Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2cd4e9bf61",
        "name": "Xã Định Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d8d102abe7",
        "name": "Xã Đông Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20d3205fc6",
        "name": "Xã Đông Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-04abd6dfb3",
        "name": "Xã Đông Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1afb635f82",
        "name": "Xã Giang Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-584e09b46a",
        "name": "Xã Giồng Riềng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eba6af41cf",
        "name": "Xã Gò Quao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d89c74ae9",
        "name": "Xã Hòa Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a403c5bcc",
        "name": "Xã Hòa Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c521df7f39",
        "name": "Xã Hòa Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5a86bf9a0a",
        "name": "Xã Hòa Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d4767057d",
        "name": "Xã Hòn Đất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-08722c3da2",
        "name": "Xã Hòn Nghệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5a1f6582e2",
        "name": "Xã Hội An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-863471a0c2",
        "name": "Xã Khánh Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-75ceca5b57",
        "name": "Xã Kiên Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf8a271ce2",
        "name": "Xã Long Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f0dba4b691",
        "name": "Xã Long Kiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c98820a3bf",
        "name": "Xã Long Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb1bcaa2e9",
        "name": "Xã Mỹ Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-16162e7b89",
        "name": "Xã Mỹ Hòa Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28d68a0beb",
        "name": "Xã Mỹ Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-65685869fe",
        "name": "Xã Ngọc Chúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1897f56d9d",
        "name": "Xã Nhơn Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-917cc398cf",
        "name": "Xã Nhơn Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-01db54f4a9",
        "name": "Xã Núi Cấm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-90c710df82",
        "name": "Xã Óc Eo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9170850352",
        "name": "Xã Ô Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2b9981584",
        "name": "Xã Phú An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b86c153979",
        "name": "Xã Phú Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f03dc87777",
        "name": "Xã Phú Hữu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20e0bf2476",
        "name": "Xã Phú Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-018fd196f1",
        "name": "Xã Phú Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-523cf44274",
        "name": "Xã Sơn Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-966d527274",
        "name": "Xã Sơn Kiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23e790b40c",
        "name": "Xã Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5672256cea",
        "name": "Xã Tân Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50b9ecb87c",
        "name": "Xã Tân Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ff0597939",
        "name": "Xã Tân Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a834615c07",
        "name": "Xã Tây Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ec388ae2ed",
        "name": "Xã Tây Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac74e8276d",
        "name": "Xã Thạnh Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-715b2bc490",
        "name": "Xã Thạnh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a99004b5f",
        "name": "Xã Thạnh Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-46f3a45b46",
        "name": "Xã Thạnh Mỹ Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-789a6c4578",
        "name": "Xã Thoại Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96469ebf94",
        "name": "Xã Tiên Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64deebd46e",
        "name": "Xã Tri Tôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ef2ae4cfc",
        "name": "Xã U Minh Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e481bbbff1",
        "name": "Xã Vân Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a68e428087",
        "name": "Xã Vĩnh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac5f4bf860",
        "name": "Xã Vĩnh Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e0e3db768",
        "name": "Xã Vĩnh Điều",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-106062689b",
        "name": "Xã Vĩnh Gia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cdcb6893f9",
        "name": "Xã Vĩnh Hanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-693cd3d71a",
        "name": "Xã Vĩnh Hậu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f8fd97b402",
        "name": "Xã Vĩnh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d3541cb847",
        "name": "Xã Vĩnh Hòa Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5df7a431f5",
        "name": "Xã Vĩnh Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b56d90b74f",
        "name": "Xã Vĩnh Thạnh Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a9a08edf8",
        "name": "Xã Vĩnh Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7faa2ba823",
        "name": "Xã Vĩnh Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ca60b1919",
        "name": "Xã Vĩnh Tuy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03c4682a1c",
        "name": "Xã Vĩnh Xương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-8437cb263d",
    "name": "Tỉnh Bắc Ninh",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-40326f0c41",
        "name": "Phường Bắc Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84900789c0",
        "name": "Phường Bồng Lai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-81c248ddbf",
        "name": "Phường Cảnh Thụy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2cb2b194be",
        "name": "Phường Chũ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff00d449b7",
        "name": "Phường Đa Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f52b7a60b2",
        "name": "Phường Đào Viên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2075fb1c22",
        "name": "Phường Đồng Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-55cfcb9d59",
        "name": "Phường Hạp Lĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20e11d74f2",
        "name": "Phường Kinh Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb0ac67df4",
        "name": "Phường Mão Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ec9dfc1a43",
        "name": "Phường Nam Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6608c59eb",
        "name": "Phường Nếnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-47f67ea68a",
        "name": "Phường Nhân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a8104f7ad",
        "name": "Phường Ninh Xá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8a78c131c7",
        "name": "Phường Phù Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c11f6fbc25",
        "name": "Phường Phương Liễu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d06459b61",
        "name": "Phường Phượng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a8699b146d",
        "name": "Phường Quế Võ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23c3026373",
        "name": "Phường Song Liễu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f70af31911",
        "name": "Phường Tam Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc0915f30a",
        "name": "Phường Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a4e5de1919",
        "name": "Phường Tân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-24d4b79005",
        "name": "Phường Thuận Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e27576b488",
        "name": "Phường Tiền Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27cec5f456",
        "name": "Phường Trạm Lộ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-750a8a2346",
        "name": "Phường Trí Quả",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb98ecb7e3",
        "name": "Phường Tự Lạn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db3cede444",
        "name": "Phường Từ Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60c4afeca4",
        "name": "Phường Vân Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ef76f74b7",
        "name": "Phường Việt Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e95215a71f",
        "name": "Phường Võ Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e45e82f2e",
        "name": "Phường Vũ Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c54a4ba290",
        "name": "Phường Yên Dũng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db0d355f7f",
        "name": "Xã An Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32d1d75ac9",
        "name": "Xã Bảo Đài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-efbaca1698",
        "name": "Xã Bắc Lũng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ce5c2d0242",
        "name": "Xã Biển Động",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50be0965aa",
        "name": "Xã Biên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e44333a2c",
        "name": "Xã Bố Hạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-747f35d8c8",
        "name": "Xã Cao Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-69f28dcd95",
        "name": "Xã Cẩm Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1de5f6dc47",
        "name": "Xã Chi Lăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eaa1cecb56",
        "name": "Xã Dương Hưu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2fe5144ea",
        "name": "Xã Đại Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28ecc2db93",
        "name": "Xã Đại Lai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1010a317c",
        "name": "Xã Đại Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8b88ce8440",
        "name": "Xã Đèo Gia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-61591aeca4",
        "name": "Xã Đông Cứu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d82c04936f",
        "name": "Xã Đồng Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2f16abf4ae",
        "name": "Xã Đông Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-501b666bbc",
        "name": "Xã Đồng Việt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-79fda6600a",
        "name": "Xã Gia Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c8bbb20e59",
        "name": "Xã Hiệp Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-703400f3e7",
        "name": "Xã Hoàng Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-113760e1b1",
        "name": "Xã Hợp Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b48e5e520",
        "name": "Xã Kép",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32a093646d",
        "name": "Xã Kiên Lao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-55745db66f",
        "name": "Xã Lạng Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d2108df16",
        "name": "Xã Lâm Thao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-07d5892a74",
        "name": "Xã Liên Bão",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d963dcd6f",
        "name": "Xã Lục Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5553408a6d",
        "name": "Xã Lục Ngạn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0efb8fff05",
        "name": "Xã Lục Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-97fca30648",
        "name": "Xã Lương Tài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-40f8b940bc",
        "name": "Xã Mỹ Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-117b9e11f0",
        "name": "Xã Nam Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a21ba7125e",
        "name": "Xã Nghĩa Phương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0dc09ff157",
        "name": "Xã Ngọc Thiện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-875326a215",
        "name": "Xã Nhã Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be9e37db23",
        "name": "Xã Nhân Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1778d8ad47",
        "name": "Xã Phật Tích",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-979fac7f30",
        "name": "Xã Phù Lãng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-97f4dba51d",
        "name": "Xã Phúc Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84b40ec29d",
        "name": "Xã Quang Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9dc6d21211",
        "name": "Xã Sa Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-07547f17e5",
        "name": "Xã Sơn Động",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3563513afe",
        "name": "Xã Sơn Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a488640a18",
        "name": "Xã Tam Đa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-772a373f29",
        "name": "Xã Tam Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e9b610846",
        "name": "Xã Tam Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b6f8ac86df",
        "name": "Xã Tân Chi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-42d90ff963",
        "name": "Xã Tân Dĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5394771d89",
        "name": "Xã Tân Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa210f516e",
        "name": "Xã Tân Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e18e3418d0",
        "name": "Xã Tây Yên Tử",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb643bca9b",
        "name": "Xã Tiên Du",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23d6bb5f00",
        "name": "Xã Tiên Lục",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fe3454a29c",
        "name": "Xã Trung Chính",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f386920a16",
        "name": "Xã Trung Kênh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c4de653ab",
        "name": "Xã Trường Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4a27a48715",
        "name": "Xã Tuấn Đạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d103c147b",
        "name": "Xã Văn Môn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a341756584",
        "name": "Xã Vân Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-887e109144",
        "name": "Xã Xuân Cẩm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b06b1511a",
        "name": "Xã Xuân Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4cbd1f5138",
        "name": "Xã Yên Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6ec623ad26",
        "name": "Xã Yên Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e455e122b",
        "name": "Xã Yên Thế",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2dd8f9ec3a",
        "name": "Xã Yên Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-76323cfad7",
    "name": "Tỉnh Cà Mau",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-e97f8db754",
        "name": "Phường An Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d162c2c3dd",
        "name": "Phường Bạc Liêu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a6ea4f6e23",
        "name": "Phường Giá Rai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-adff875100",
        "name": "Phường Hiệp Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4f13940405",
        "name": "Phường Hòa Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f10d1e5fbe",
        "name": "Phường Láng Tròn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3340f3fd61",
        "name": "Phường Lý Văn Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-72489e9ee0",
        "name": "Phường Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6039f78e6d",
        "name": "Phường Vĩnh Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b12434c1b",
        "name": "Xã An Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-52d8968dc1",
        "name": "Xã Biển Bạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c7c672e85",
        "name": "Xã Cái Đôi Vàm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-698023825b",
        "name": "Xã Cái Nước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d1af61ee57",
        "name": "Xã Châu Thới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d5a9cea30",
        "name": "Xã Đá Bạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-14549e3073",
        "name": "Xã Đầm Dơi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-35be9e93e1",
        "name": "Xã Đất Mới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a2d85607c0",
        "name": "Xã Đất Mũi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-785ffec6ce",
        "name": "Xã Định Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ece03ba02",
        "name": "Xã Đông Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4907a78628",
        "name": "Xã Gành Hào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-59b4d48eb7",
        "name": "Xã Hòa Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7f21d78e5",
        "name": "Xã Hồ Thị Kỷ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2000a97c2d",
        "name": "Xã Hồng Dân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0e74f549dd",
        "name": "Xã Hưng Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6d79d7f3e8",
        "name": "Xã Hưng Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f023b3fa0",
        "name": "Xã Khánh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d6daa5e4d9",
        "name": "Xã Khánh Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ef38d6b43",
        "name": "Xã Khánh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c1b111054",
        "name": "Xã Khánh Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac0d7d1942",
        "name": "Xã Long Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cb13136ae3",
        "name": "Xã Lương Thế Trân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-33371bea9a",
        "name": "Xã Năm Căn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-526056f338",
        "name": "Xã Nguyễn Phích",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-afcad3577d",
        "name": "Xã Nguyễn Việt Khái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5b283e52bc",
        "name": "Xã Ninh Quới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f08791e7d6",
        "name": "Xã Ninh Thạnh Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4096eec921",
        "name": "Xã Phan Ngọc Hiển",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e2e80f05ce",
        "name": "Xã Phong Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b3784bd999",
        "name": "Xã Phong Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7746de1efd",
        "name": "Xã Phú Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eef51feb66",
        "name": "Xã Phú Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a8ea3ed42e",
        "name": "Xã Phước Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ef6f36785",
        "name": "Xã Quách Phẩm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f28a381536",
        "name": "Xã Sông Đốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-932fff3d7a",
        "name": "Xã Tạ An Khương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b54c5e6922",
        "name": "Xã Tam Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4251c33954",
        "name": "Xã Tân Ân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ffc0d535d3",
        "name": "Xã Tân Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0cce62db7a",
        "name": "Xã Tân Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fd6771f8ed",
        "name": "Xã Tân Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d5199603c9",
        "name": "Xã Tân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f2ac5366a",
        "name": "Xã Thanh Tùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64979f6473",
        "name": "Xã Thới Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-17454c5cd0",
        "name": "Xã Trần Phán",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-306b781822",
        "name": "Xã Trần Văn Thời",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3508a73533",
        "name": "Xã Trí Phải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8295399525",
        "name": "Xã U Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a74c7eec58",
        "name": "Xã Vĩnh Hậu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-52e21e9d15",
        "name": "Xã Vĩnh Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-40d99cc281",
        "name": "Xã Vĩnh Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-772bccccad",
        "name": "Xã Vĩnh Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-63ddbd7ea3",
        "name": "Xã Vĩnh Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6c04f880a",
        "name": "Xã Vĩnh Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-3d1e639c66",
    "name": "Tỉnh Cao Bằng",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-d152c114c4",
        "name": "Phường Nùng Trí Cao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d6d7c339a0",
        "name": "Phường Tân Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d6929e1099",
        "name": "Phường Thục Phán",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b8e905ddf3",
        "name": "Xã Bạch Đằng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ccf4cb6ef3",
        "name": "Xã Bảo Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9b196b50cb",
        "name": "Xã Bảo Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab281b3186",
        "name": "Xã Bế Văn Đàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-781cb1c466",
        "name": "Xã Ca Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab63207969",
        "name": "Xã Canh Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a1dd8e8ced",
        "name": "Xã Cần Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-779169ef33",
        "name": "Xã Cô Ba",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6d79cf1eb2",
        "name": "Xã Cốc Pàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3fb3f45ffd",
        "name": "Xã Đàm Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4fb02a8f6b",
        "name": "Xã Đình Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f45e6b2a49",
        "name": "Xã Đoài Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb2ad9c262",
        "name": "Xã Độc Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3118b9fc41",
        "name": "Xã Đông Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ced8c5ef82",
        "name": "Xã Đức Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ed22d5261",
        "name": "Xã Hạ Lang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1df825b45c",
        "name": "Xã Hà Quảng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b645c6b980",
        "name": "Xã Hạnh Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0271a10ea7",
        "name": "Xã Hòa An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-35b571a533",
        "name": "Xã Huy Giáp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c1a19fd511",
        "name": "Xã Hưng Đạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb9c7527bf",
        "name": "Xã Khánh Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3f53b951a3",
        "name": "Xã Kim Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-add58f3110",
        "name": "Xã Lũng Nặm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c10b9fba2b",
        "name": "Xã Lý Bôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f3e24ab6c",
        "name": "Xã Lý Quốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7048b5557d",
        "name": "Xã Minh Khai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b635dfd4f7",
        "name": "Xã Minh Tâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2600a41385",
        "name": "Xã Nam Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c5bbaa0d7",
        "name": "Xã Nam Tuấn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad22565550",
        "name": "Xã Nguyên Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-566b12de99",
        "name": "Xã Nguyễn Huệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-34f7b9d231",
        "name": "Xã Phan Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4201b905bd",
        "name": "Xã Phục Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae34f2445e",
        "name": "Xã Quang Hán",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a685c20738",
        "name": "Xã Quảng Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-66d2e3ecab",
        "name": "Xã Quang Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-24f417b076",
        "name": "Xã Quang Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-01cd6bbb4e",
        "name": "Xã Quảng Uyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-990b60ed67",
        "name": "Xã Sơn Lộ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d3d533ac0",
        "name": "Xã Tam Kim",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dabf2910d6",
        "name": "Xã Thạch An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8fe7ea147a",
        "name": "Xã Thành Công",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a461cb598d",
        "name": "Xã Thanh Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2067681ce0",
        "name": "Xã Thông Nông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e8554d5c11",
        "name": "Xã Tĩnh Túc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-441048c69e",
        "name": "Xã Tổng Cọt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-862ce387c9",
        "name": "Xã Trà Lĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e51b2c461",
        "name": "Xã Trùng Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dd55a8c9bf",
        "name": "Xã Trường Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-77a84d3721",
        "name": "Xã Vinh Quý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a106c653e",
        "name": "Xã Xuân Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-33b77c8630",
        "name": "Xã Yên Thổ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-81fc1c2a11",
    "name": "Tỉnh Đắk Lắk",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-f4fd0070af",
        "name": "Phường Bình Kiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-310a1a8edc",
        "name": "Phường Buôn Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b3ffa9517",
        "name": "Phường Buôn Ma Thuột",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f75ee32050",
        "name": "Phường Cư Bao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8404abf02a",
        "name": "Phường Đông Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7239f6069",
        "name": "Phường Ea Kao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dd1b538e3c",
        "name": "Phường Hòa Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d9fbe503cf",
        "name": "Phường Phú Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-da7353c69a",
        "name": "Phường Sông Cầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c10407773a",
        "name": "Phường Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ea2fca6b15",
        "name": "Phường Tân Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fcbd3dc1a1",
        "name": "Phường Thành Nhất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a6caba825",
        "name": "Phường Tuy Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8c692756d1",
        "name": "Phường Xuân Đài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1a6baa7c42",
        "name": "Xã Buôn Đôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23d2511824",
        "name": "Xã Cuôr Đăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b79d885e1a",
        "name": "Xã Cư M’Gar",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c5b4be478c",
        "name": "Xã Cư M’Ta",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64221f6424",
        "name": "Xã Cư Pơng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9cd1f94633",
        "name": "Xã Cư Prao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d839e8dca",
        "name": "Xã Cư Pui",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-732a1b767e",
        "name": "Xã Cư Yang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6f28649f6",
        "name": "Xã Dang Kang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c255cd0621",
        "name": "Xã Dliê Ya",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa2a8f36da",
        "name": "Xã Dray Bhăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a3b8f9cd59",
        "name": "Xã Dur Kmăl",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fc5e0b09e0",
        "name": "Xã Đắk Liêng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-087df65d86",
        "name": "Xã Đắk Phơi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e03108c70b",
        "name": "Xã Đồng Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5271b0919d",
        "name": "Xã Đức Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-44492996f8",
        "name": "Xã Ea Bá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-22fe7ccc02",
        "name": "Xã Ea Bung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-daff981b97",
        "name": "Xã Ea Drăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0cae232295",
        "name": "Xã Ea Drông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7c118a84e4",
        "name": "Xã Ea H’Leo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e66d865063",
        "name": "Xã Ea Hiao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-71b2ffb466",
        "name": "Xã Ea Kar",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a3c4de20c7",
        "name": "Xã Ea Khăl",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-68a5474a8e",
        "name": "Xã Ea Kiết",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87101bef49",
        "name": "Xã Ea Kly",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5b4c020168",
        "name": "Xã Ea Knốp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ce1639ddfc",
        "name": "Xã Ea Knuếc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-35ac54a4e4",
        "name": "Xã Ea Ktur",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e5b7897d8d",
        "name": "Xã Ea Ly",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b81e4114c",
        "name": "Xã Ea M’Droh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d21004de87",
        "name": "Xã Ea Na",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7dd48c1e29",
        "name": "Xã Ea Ning",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3fd82ebad2",
        "name": "Xã Ea Nuôl",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b171280155",
        "name": "Xã Ea Ô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca7f9956f7",
        "name": "Xã Ea Păl",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4350a6191b",
        "name": "Xã Ea Phê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d0afccf2bb",
        "name": "Xã Ea Riêng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e600858802",
        "name": "Xã Ea Rốk",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a3a0ba7bb5",
        "name": "Xã Ea Súp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9bc4ef1fb0",
        "name": "Xã Ea Trang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c779d0c6d",
        "name": "Xã Ea Tul",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7fd4dc6360",
        "name": "Xã Ea Wer",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d69d44aa86",
        "name": "Xã Ea Wy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f4bee92793",
        "name": "Xã Hòa Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b8c9710bd",
        "name": "Xã Hòa Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e77bbd690",
        "name": "Xã Hòa Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d54b3be6b",
        "name": "Xã Hòa Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28bcf38669",
        "name": "Xã Hòa Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7688a06a8",
        "name": "Xã Ia Lốp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b038842d16",
        "name": "Xã Ia Rvê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c9d484fe96",
        "name": "Xã Krông Á",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d0622e038e",
        "name": "Xã Krông Ana",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c7847f4ac7",
        "name": "Xã Krông Bông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-78a446251c",
        "name": "Xã Krông Búk",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1d3993c2cd",
        "name": "Xã Krông Năng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6801db5bae",
        "name": "Xã Krông Nô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c4dd4aaef1",
        "name": "Xã Krông Pắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9939e0a36",
        "name": "Xã Liên Sơn Lắk",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a5e8fbd604",
        "name": "Xã M’Drắk",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-86d1b0dbf2",
        "name": "Xã Nam Ka",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bbade21915",
        "name": "Xã Ô Loan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d1a5050cdf",
        "name": "Xã Phú Hòa 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf3e42acff",
        "name": "Xã Phú Hòa 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c1f56502c0",
        "name": "Xã Phú Mỡ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9dd6ffb38a",
        "name": "Xã Phú Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-95fae0bcef",
        "name": "Xã Pơng Drang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb50a93d0d",
        "name": "Xã Quảng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f08dccef1",
        "name": "Xã Sông Hinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c1e5763e4",
        "name": "Xã Sơn Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-95aa9d1bff",
        "name": "Xã Sơn Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa86f8ef85",
        "name": "Xã Suối Trai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b09d17e82f",
        "name": "Xã Tam Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db75341d87",
        "name": "Xã Tân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-382c3d852c",
        "name": "Xã Tây Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87a2496ffc",
        "name": "Xã Tây Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a921ee5ca",
        "name": "Xã Tuy An Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ebe1d2c83",
        "name": "Xã Tuy An Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be1865002c",
        "name": "Xã Tuy An Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf2959a859",
        "name": "Xã Tuy An Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-72951b9eaa",
        "name": "Xã Vân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd83ea0474",
        "name": "Xã Vụ Bổn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dce9d7844e",
        "name": "Xã Xuân Cảnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c38a775c37",
        "name": "Xã Xuân Lãnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3184175cd4",
        "name": "Xã Xuân Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ba503a66d9",
        "name": "Xã Xuân Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03da9aeaf9",
        "name": "Xã Xuân Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fc5836c305",
        "name": "Xã Yang Mao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-219a5e0a95",
    "name": "Tỉnh Điện Biên",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-353f8ea4ba",
        "name": "Phường Điện Biên Phủ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c60446cc18",
        "name": "Phường Mường Lay",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ef54cad70f",
        "name": "Phường Mường Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7132588ff1",
        "name": "Xã Búng Lao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-592f332e37",
        "name": "Xã Chà Tở",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-200140d011",
        "name": "Xã Chiềng Sinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c10ab2c201",
        "name": "Xã Mường Ảng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c5a317fe77",
        "name": "Xã Mường Chà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a31c5d504",
        "name": "Xã Mường Lạn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bae9cb4113",
        "name": "Xã Mường Luân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-36360a17e3",
        "name": "Xã Mường Mùn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-019b14fd54",
        "name": "Xã Mường Nhà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bfc366e5a0",
        "name": "Xã Mường Nhé",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-190143ee69",
        "name": "Xã Mường Phăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-045db032d8",
        "name": "Xã Mường Pồn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2037fc9a10",
        "name": "Xã Mường Toong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e4036906e3",
        "name": "Xã Mường Tùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84cc58f0e2",
        "name": "Xã Nà Bủng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-24c879208b",
        "name": "Xã Nà Hỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-473fd331bb",
        "name": "Xã Na Sang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-325017add5",
        "name": "Xã Na Son",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a47fa0c9ad",
        "name": "Xã Nà Tấu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99bbafe1a9",
        "name": "Xã Nậm Kè",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0fedfee500",
        "name": "Xã Nậm Nèn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-179c3c6f49",
        "name": "Xã Núa Ngam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-286fd7cf31",
        "name": "Xã Pa Ham",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c152f3ce99",
        "name": "Xã Phình Giàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-847b1b1892",
        "name": "Xã Pu Nhi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-06b28f2c32",
        "name": "Xã Pú Nhung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-590664d1c5",
        "name": "Xã Quài Tở",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8cb699285f",
        "name": "Xã Quảng Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a3d711b65",
        "name": "Xã Sam Mứn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1283c40054",
        "name": "Xã Sáng Nhè",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-18acfcab07",
        "name": "Xã Si Pa Phìn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-47688e86d3",
        "name": "Xã Sín Chải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b620442f40",
        "name": "Xã Sín Thầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6920171e1c",
        "name": "Xã Sính Phình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c3eca923b2",
        "name": "Xã Thanh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-59d975b6da",
        "name": "Xã Thanh Nưa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67e84066fa",
        "name": "Xã Thanh Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-647fe68f5d",
        "name": "Xã Tìa Dình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-163eecab6e",
        "name": "Xã Tủa Chùa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-951bacfacb",
        "name": "Xã Tủa Thàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd09a53b5f",
        "name": "Xã Tuần Giáo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fde52e71cc",
        "name": "Xã Xa Dung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-4ad338f07f",
    "name": "Tỉnh Đồng Nai",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-10b9ed08fe",
        "name": "Phường An Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4dc3a5d0e8",
        "name": "Phường Bảo Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d76d1398e5",
        "name": "Phường Biên Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-339495d72a",
        "name": "Phường Bình Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-abb2e0aa8d",
        "name": "Phường Bình Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c870838af",
        "name": "Phường Bình Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7796c2f96",
        "name": "Phường Chơn Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ec122e8bc7",
        "name": "Phường Đồng Xoài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9725f5f98",
        "name": "Phường Hàng Gòn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a33ca57308",
        "name": "Phường Hố Nai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ab910b9c3",
        "name": "Phường Long Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f924df654",
        "name": "Phường Long Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e6be3856c",
        "name": "Phường Long Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03c8dfce7b",
        "name": "Phường Minh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-062c4acaa8",
        "name": "Phường Phước Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2076388a7e",
        "name": "Phường Phước Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-73f8610574",
        "name": "Phường Phước Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8fc69894dc",
        "name": "Phường Tam Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-69a2a13345",
        "name": "Phường Tam Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d7db8510be",
        "name": "Phường Tân Triều",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b5eddd718c",
        "name": "Phường Trảng Dài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eca43fc32e",
        "name": "Phường Trấn Biên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-775a6c4dca",
        "name": "Phường Xuân Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-19a56c52ab",
        "name": "Xã An Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-14a7cce3d8",
        "name": "Xã An Viễn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f5cc405e3",
        "name": "Xã Bàu Hàm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-63705b5cfa",
        "name": "Xã Bình An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a39d878b4c",
        "name": "Xã Bình Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-183ea389a4",
        "name": "Xã Bình Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e67188866e",
        "name": "Xã Bom Bo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cfd99d9cca",
        "name": "Xã Bù Đăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23cfca43be",
        "name": "Xã Bù Gia Mập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7e76633e8",
        "name": "Xã Cẩm Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e4ee91a03c",
        "name": "Xã Dầu Giây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-853ff15027",
        "name": "Xã Đa Kia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8a1977d51b",
        "name": "Xã Đại Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f35b8d1b08",
        "name": "Xã Đak Lua",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1bf70e65e4",
        "name": "Xã Đak Nhau",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e5e467a113",
        "name": "Xã Đăk Ơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7b28a13216",
        "name": "Xã Định Quán",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-777dff3886",
        "name": "Xã Đồng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-131c9ba08c",
        "name": "Xã Đồng Tâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-313180af74",
        "name": "Xã Gia Kiệm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f0b10b2cc3",
        "name": "Xã Hưng Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76188ccafe",
        "name": "Xã Hưng Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0618c82426",
        "name": "Xã La Ngà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1b796bfb2a",
        "name": "Xã Long Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-051efc5053",
        "name": "Xã Long Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e9ae71f9b8",
        "name": "Xã Long Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f29f97596a",
        "name": "Xã Lộc Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-89c1ac9ad7",
        "name": "Xã Lộc Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87924a2686",
        "name": "Xã Lộc Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ea4dbac7b8",
        "name": "Xã Lộc Tấn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0b67a3e456",
        "name": "Xã Lộc Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f50a1d1f8a",
        "name": "Xã Lộc Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-395adff19a",
        "name": "Xã Minh Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-98f3b48bf5",
        "name": "Xã Nam Cát Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4101442994",
        "name": "Xã Nghĩa Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84de8ce8e5",
        "name": "Xã Nha Bích",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-793fd3e064",
        "name": "Xã Nhơn Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e46a852274",
        "name": "Xã Phú Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8b39a35318",
        "name": "Xã Phú Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96e802bab3",
        "name": "Xã Phú Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-34d9b0555f",
        "name": "Xã Phú Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c36ccae9f7",
        "name": "Xã Phú Riềng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-44dae2dbfa",
        "name": "Xã Phú Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f3b5a0edd4",
        "name": "Xã Phú Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f57645857",
        "name": "Xã Phước An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e351bd6571",
        "name": "Xã Phước Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-62c902a617",
        "name": "Xã Phước Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-391017c790",
        "name": "Xã Sông Ray",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28bea8ad76",
        "name": "Xã Tà Lài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8c4f691f4a",
        "name": "Xã Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-29ef88ceda",
        "name": "Xã Tân Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b30e7fb7bf",
        "name": "Xã Tân Khai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c41a307080",
        "name": "Xã Tân Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76c884b552",
        "name": "Xã Tân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f887f9fe5a",
        "name": "Xã Tân Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a287f67ac",
        "name": "Xã Tân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-095baa79ad",
        "name": "Xã Thanh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-888aa8ae0c",
        "name": "Xã Thiện Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-75e7c02668",
        "name": "Xã Thọ Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6e6a12020a",
        "name": "Xã Thống Nhất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-131bcb6b61",
        "name": "Xã Thuận Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dd680f710c",
        "name": "Xã Trảng Bom",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4190eacc15",
        "name": "Xã Trị An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-19569fdd0a",
        "name": "Xã Xuân Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0904b9884c",
        "name": "Xã Xuân Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eac72d289b",
        "name": "Xã Xuân Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b0cac48df1",
        "name": "Xã Xuân Đường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b443c6b3fa",
        "name": "Xã Xuân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ba2429795",
        "name": "Xã Xuân Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3aa590c25d",
        "name": "Xã Xuân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae273e22e7",
        "name": "Xã Xuân Quế",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aaaf056ea5",
        "name": "Xã Xuân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-b0d175c39b",
    "name": "Tỉnh Đồng Tháp",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-706071904d",
        "name": "Phường An Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb43471202",
        "name": "Phường Bình Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6bd6b0b84",
        "name": "Phường Cai Lậy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-151e294a7c",
        "name": "Phường Cao Lãnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dfee1c5826",
        "name": "Phường Đạo Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a00a1c631",
        "name": "Phường Gò Công",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0f371e15ea",
        "name": "Phường Hồng Ngự",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c72d93f79",
        "name": "Phường Long Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3912d93896",
        "name": "Phường Mỹ Ngãi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2d07592772",
        "name": "Phường Mỹ Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e651cb7a2",
        "name": "Phường Mỹ Phước Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0898a0f458",
        "name": "Phường Mỹ Tho",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9e711a7977",
        "name": "Phường Mỹ Trà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00df2be726",
        "name": "Phường Nhị Quý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a41045b4ac",
        "name": "Phường Sa Đéc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f75d35656a",
        "name": "Phường Sơn Qui",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc2970fe1f",
        "name": "Phường Thanh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f334ad8208",
        "name": "Phường Thới Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2fb1ab2d1b",
        "name": "Phường Thường Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aca85c0579",
        "name": "Phường Trung An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9748d3fb18",
        "name": "Xã An Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8c3275e7c5",
        "name": "Xã An Hữu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2d7ba3c260",
        "name": "Xã An Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e0483278e3",
        "name": "Xã An Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-476aac19df",
        "name": "Xã An Thạnh Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b07a9a7500",
        "name": "Xã Ba Sao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e50437455e",
        "name": "Xã Bình Hàng Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b9018401b",
        "name": "Xã Bình Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d154f4da8b",
        "name": "Xã Bình Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-de6a9730a4",
        "name": "Xã Bình Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d00e15adf4",
        "name": "Xã Bình Trưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9696189a5f",
        "name": "Xã Cái Bè",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dbf58571cf",
        "name": "Xã Châu Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-65a2f541d6",
        "name": "Xã Chợ Gạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dac805d14b",
        "name": "Xã Đốc Binh Kiều",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c46542894e",
        "name": "Xã Đồng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f84e371fe2",
        "name": "Xã Gia Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e3af3a696",
        "name": "Xã Gò Công Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-53417a0d1e",
        "name": "Xã Hậu Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83df27304a",
        "name": "Xã Hiệp Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76bcb4948e",
        "name": "Xã Hòa Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6fa5a29e01",
        "name": "Xã Hội Cư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c78b47c848",
        "name": "Xã Hưng Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e473c15a6c",
        "name": "Xã Kim Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-abf8fcb9c9",
        "name": "Xã Lai Vung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4aab6be677",
        "name": "Xã Lấp Vò",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1c0fc9b0f",
        "name": "Xã Long Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a1b4494ff2",
        "name": "Xã Long Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c899b40e78",
        "name": "Xã Long Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be0b4ef224",
        "name": "Xã Long Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e26d16f241",
        "name": "Xã Long Phú Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7c7418ec4e",
        "name": "Xã Long Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f9e1418f0",
        "name": "Xã Lương Hòa Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-705a2896cc",
        "name": "Xã Mỹ An Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-54cfded47f",
        "name": "Xã Mỹ Đức Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-56f61458e4",
        "name": "Xã Mỹ Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-52f8fd60e2",
        "name": "Xã Mỹ Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f33e103b22",
        "name": "Xã Mỹ Quí",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-80ed7a3020",
        "name": "Xã Mỹ Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab2ad0556d",
        "name": "Xã Mỹ Thiện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-775dd428d5",
        "name": "Xã Mỹ Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32f5410a61",
        "name": "Xã Mỹ Tịnh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb922605a3",
        "name": "Xã Ngũ Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-796be473d8",
        "name": "Xã Phong Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c6d921437",
        "name": "Xã Phong Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-26e0ed3ec2",
        "name": "Xã Phú Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c92380b7f7",
        "name": "Xã Phú Hựu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ee79a7dc3",
        "name": "Xã Phú Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-51747bf6de",
        "name": "Xã Phú Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa2d1e41a7",
        "name": "Xã Phương Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8b59c504af",
        "name": "Xã Tam Nông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20e9ee6c0b",
        "name": "Xã Tân Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ce8a76387",
        "name": "Xã Tân Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b740a5fc1e",
        "name": "Xã Tân Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2814c6d3cf",
        "name": "Xã Tân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3255944b39",
        "name": "Xã Tân Hộ Cơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2423c959e",
        "name": "Xã Tân Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6d6225f3ce",
        "name": "Xã Tân Hương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4046a15169",
        "name": "Xã Tân Khánh Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca1d2b9bfb",
        "name": "Xã Tân Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b4db672ac3",
        "name": "Xã Tân Nhuận Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5f9bb50766",
        "name": "Xã Tân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c64af4c332",
        "name": "Xã Tân Phú Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e0bd172533",
        "name": "Xã Tân Phú Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6eb10f217a",
        "name": "Xã Tân Phước 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f89fa5cb5f",
        "name": "Xã Tân Phước 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50a0136aec",
        "name": "Xã Tân Phước 3",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-57a0b0f208",
        "name": "Xã Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e9e904909e",
        "name": "Xã Tân Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ad5484271",
        "name": "Xã Tân Thới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-953c1207ff",
        "name": "Xã Tân Thuận Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85dd4d6724",
        "name": "Xã Thanh Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e7c33eab0d",
        "name": "Xã Thanh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8bb7ece05b",
        "name": "Xã Thanh Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d8039ab229",
        "name": "Xã Thạnh Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-671a3209e3",
        "name": "Xã Tháp Mười",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a5b9d6fe7",
        "name": "Xã Thường Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-061760afed",
        "name": "Xã Tràm Chim",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2167fcfc6d",
        "name": "Xã Trường Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-78fad6eded",
        "name": "Xã Vĩnh Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d98f93267",
        "name": "Xã Vĩnh Hựu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e33a3f2b0",
        "name": "Xã Vĩnh Kim",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-02f34e216e",
    "name": "Tỉnh Gia Lai",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-054c370fd8",
        "name": "Phường An Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-74a3f2ac51",
        "name": "Phường An Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7c1fe8b6ed",
        "name": "Phường An Nhơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f6331eca6",
        "name": "Phường An Nhơn Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-596b46a6df",
        "name": "Phường An Nhơn Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e50ba0a01f",
        "name": "Phường An Nhơn Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f8b9a6627",
        "name": "Phường An Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c9129656f0",
        "name": "Phường Ayun Pa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c077420a7",
        "name": "Phường Bình Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a0b72e2d5",
        "name": "Phường Bồng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-835c2d99af",
        "name": "Phường Diên Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8783e0ede1",
        "name": "Phường Hoài Nhơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-54da345779",
        "name": "Phường Hoài Nhơn Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-81dec2d4e1",
        "name": "Phường Hoài Nhơn Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf619be5d0",
        "name": "Phường Hoài Nhơn Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4414ff9f87",
        "name": "Phường Hoài Nhơn Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1af311f55",
        "name": "Phường Hội Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b85fee55f",
        "name": "Phường Pleiku",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-68086d4606",
        "name": "Phường Quy Nhơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4395a8db6b",
        "name": "Phường Quy Nhơn Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a41a8bdde",
        "name": "Phường Quy Nhơn Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-737631e9f8",
        "name": "Phường Quy Nhơn Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-663fc42b05",
        "name": "Phường Quy Nhơn Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15a879acca",
        "name": "Phường Tam Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c35de1d40b",
        "name": "Phường Thống Nhất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1652da3e41",
        "name": "Xã Al Bá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e52407312",
        "name": "Xã An Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c193b6fc55",
        "name": "Xã An Lão",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9914734481",
        "name": "Xã An Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fd67da5b72",
        "name": "Xã An Nhơn Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9280214e9c",
        "name": "Xã An Toàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a6f4bdfabf",
        "name": "Xã An Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9526fd73c8",
        "name": "Xã Ayun",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bdd89d4ea1",
        "name": "Xã Ân Hảo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-66494e6b88",
        "name": "Xã Ân Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ccaeee8705",
        "name": "Xã Bàu Cạn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae035eea25",
        "name": "Xã Biển Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f23339527a",
        "name": "Xã Bình An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b4932bd491",
        "name": "Xã Bình Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3f1be7d37c",
        "name": "Xã Bình Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f0df1b6703",
        "name": "Xã Bình Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b612f17b00",
        "name": "Xã Bình Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c7704fb65",
        "name": "Xã Bờ Ngoong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d1ce8afe5b",
        "name": "Xã Canh Liên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa096c3b35",
        "name": "Xã Canh Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d7e5f14923",
        "name": "Xã Cát Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0946f0e628",
        "name": "Xã Chơ Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d3aae7962e",
        "name": "Xã Chư A Thai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-694c9ae2c4",
        "name": "Xã Chư Krey",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5d8e091eb8",
        "name": "Xã Chư Păh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d0d20c6b5",
        "name": "Xã Chư Prông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dae6bdf779",
        "name": "Xã Chư Pưh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2804e242a7",
        "name": "Xã Chư Sê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28b4fc8007",
        "name": "Xã Cửu An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15e144eedd",
        "name": "Xã Đak Đoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-597c7e82c6",
        "name": "Xã Đak Pơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6ffc31ea67",
        "name": "Xã Đak Rong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c5d06bff2",
        "name": "Xã Đak Sơmei",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d6a769a970",
        "name": "Xã Đăk Song",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-78783f9ef4",
        "name": "Xã Đề Gi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-350ca24cc7",
        "name": "Xã Đức Cơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa6987f736",
        "name": "Xã Gào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-221c2fad9e",
        "name": "Xã Hòa Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a44e337186",
        "name": "Xã Hoài Ân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76301c80a1",
        "name": "Xã Hội Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3fd4c45066",
        "name": "Xã Hra",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c850747be4",
        "name": "Xã Ia Băng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3c25ceea8c",
        "name": "Xã Ia Boòng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-efd75cd943",
        "name": "Xã Ia Chia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d2667ef149",
        "name": "Xã Ia Dom",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9956fa5888",
        "name": "Xã Ia Dơk",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2b3406667",
        "name": "Xã Ia Dreh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27583e51d0",
        "name": "Xã Ia Grai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a2c0d86aeb",
        "name": "Xã Ia Hiao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d57b50161",
        "name": "Xã Ia Hrú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-df6785f69c",
        "name": "Xã Ia Hrung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e0391c359",
        "name": "Xã Ia Khươl",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fc6ab84997",
        "name": "Xã Ia Ko",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b6f0b9e4e",
        "name": "Xã Ia Krái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5ed2008d30",
        "name": "Xã Ia Krêl",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a3ed4e47d",
        "name": "Xã Ia Lâu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9375691d18",
        "name": "Xã Ia Le",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a45b15dd7e",
        "name": "Xã Ia Ly",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76a777df0a",
        "name": "Xã Ia Mơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e34bb36bda",
        "name": "Xã Ia Nan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6d3fa139c5",
        "name": "Xã Ia O",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-61007491f5",
        "name": "Xã Ia Pa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d52ff196d5",
        "name": "Xã Ia Phí",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b92d92c717",
        "name": "Xã Ia Pia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7c2c554727",
        "name": "Xã Ia Pnôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8a4404794f",
        "name": "Xã Ia Púch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d82fd2c66a",
        "name": "Xã Ia Rbol",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-361934c4b8",
        "name": "Xã Ia Rsai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e80040f9b",
        "name": "Xã Ia Sao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-46ec4b10ce",
        "name": "Xã Ia Tôr",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f6daab28c",
        "name": "Xã Ia Tul",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dddbeb391d",
        "name": "Xã Kbang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f583d80d79",
        "name": "Xã Kdang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fbcb480477",
        "name": "Xã Kim Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c6da8fcd8",
        "name": "Xã Kon Chiêng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-13b3bf20b4",
        "name": "Xã Kon Gang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ab95a4f32",
        "name": "Xã Kông Bơ La",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d0f1a15af6",
        "name": "Xã Kông Chro",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a036d20f03",
        "name": "Xã Krong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6353a3ffc",
        "name": "Xã Lơ Pang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a0ad75a085",
        "name": "Xã Mang Yang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a72219ab8",
        "name": "Xã Ngô Mây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4cd2e82a3f",
        "name": "Xã Nhơn Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c188587c1a",
        "name": "Xã Phù Cát",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b5174ee27",
        "name": "Xã Phù Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab6c100dbf",
        "name": "Xã Phù Mỹ Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-282b96bbc9",
        "name": "Xã Phù Mỹ Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d582e944e9",
        "name": "Xã Phù Mỹ Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-506d701fac",
        "name": "Xã Phù Mỹ Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed0b21ab98",
        "name": "Xã Phú Thiện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b217f7c31",
        "name": "Xã Phú Túc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1a2c4cf708",
        "name": "Xã Pờ Tó",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bd94645e2a",
        "name": "Xã Sơn Lang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6e3fb5a634",
        "name": "Xã Sró",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23da8bd758",
        "name": "Xã Tây Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15d2d0c529",
        "name": "Xã Tơ Tung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3c92ff63e4",
        "name": "Xã Tuy Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8fc823c8fe",
        "name": "Xã Tuy Phước Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c97262605",
        "name": "Xã Tuy Phước Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b365db63f2",
        "name": "Xã Tuy Phước Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c142723970",
        "name": "Xã Uar",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0f16bddc63",
        "name": "Xã Vạn Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-35658bf9ac",
        "name": "Xã Vân Canh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c3d0c8919",
        "name": "Xã Vĩnh Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ebf07599e0",
        "name": "Xã Vĩnh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e70ae2a6d7",
        "name": "Xã Vĩnh Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e9b825828",
        "name": "Xã Vĩnh Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a5938ba470",
        "name": "Xã Xuân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e1902a54c7",
        "name": "Xã Ya Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0464a28140",
        "name": "Xã Ya Ma",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-4d62910a3b",
    "name": "Tỉnh Hà Tĩnh",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-e08354bbb6",
        "name": "Phường Bắc Hồng Lĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f9d40816f7",
        "name": "Phường Hà Huy Tập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0b787059be",
        "name": "Phường Hải Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6ba174412",
        "name": "Phường Hoành Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50c11d2a5b",
        "name": "Phường Nam Hồng Lĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ef16a6184",
        "name": "Phường Sông Trí",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5f88d577b0",
        "name": "Phường Thành Sen",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2232ab6238",
        "name": "Phường Trần Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d01450fb63",
        "name": "Phường Vũng Áng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ddec2e30a3",
        "name": "Xã Can Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c9a14a19a9",
        "name": "Xã Cẩm Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f09dfddeff",
        "name": "Xã Cẩm Duệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed97325277",
        "name": "Xã Cẩm Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bdf23f9e73",
        "name": "Xã Cẩm Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-968cc9af76",
        "name": "Xã Cẩm Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-77022806d6",
        "name": "Xã Cẩm Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-97ca6884fa",
        "name": "Xã Cổ Đạm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6696345064",
        "name": "Xã Đan Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-18695e22a1",
        "name": "Xã Đông Kinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c95c4e58c4",
        "name": "Xã Đồng Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f2839244d",
        "name": "Xã Đồng Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a0f56b3bcc",
        "name": "Xã Đức Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c42315de7e",
        "name": "Xã Đức Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d573d12e11",
        "name": "Xã Đức Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-53c3c5ff6f",
        "name": "Xã Đức Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e42350fbd",
        "name": "Xã Đức Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b6b5c2b411",
        "name": "Xã Gia Hanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db3ac3e89d",
        "name": "Xã Hà Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dfee478c38",
        "name": "Xã Hồng Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3536111856",
        "name": "Xã Hương Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7ba98b64d",
        "name": "Xã Hương Đô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c7da3b9d6a",
        "name": "Xã Hương Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5f7bf7d7eb",
        "name": "Xã Hương Phố",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c80a7de9a5",
        "name": "Xã Hương Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ff5008d53",
        "name": "Xã Hương Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9975c5a635",
        "name": "Xã Kim Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac77875038",
        "name": "Xã Kỳ Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32351ce9ae",
        "name": "Xã Kỳ Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dd3ed2d595",
        "name": "Xã Kỳ Khang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-793bb14461",
        "name": "Xã Kỳ Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-82d76d2e72",
        "name": "Xã Kỳ Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae44f62cc9",
        "name": "Xã Kỳ Văn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-07041eae57",
        "name": "Xã Kỳ Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d452e39b57",
        "name": "Xã Lộc Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-02d559aa18",
        "name": "Xã Mai Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b55cc64889",
        "name": "Xã Mai Phụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a4bc31d18",
        "name": "Xã Nghi Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eaf47b6127",
        "name": "Xã Phúc Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2880c83e21",
        "name": "Xã Sơn Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9e22e3dd01",
        "name": "Xã Sơn Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e7cf9565f",
        "name": "Xã Sơn Kim 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cbb1955718",
        "name": "Xã Sơn Kim 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1a653394d2",
        "name": "Xã Sơn Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a8c9dd9ef7",
        "name": "Xã Sơn Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f7f6e7612",
        "name": "Xã Thạch Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c948f7afc",
        "name": "Xã Thạch Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd8e70f6f2",
        "name": "Xã Thạch Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a230edff3a",
        "name": "Xã Thạch Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ccc5dd792e",
        "name": "Xã Thiên Cầm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8acd5e907b",
        "name": "Xã Thượng Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9197a10879",
        "name": "Xã Tiên Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-480065e22d",
        "name": "Xã Toàn Lưu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-36d00d2f54",
        "name": "Xã Trường Lưu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-05eed08fab",
        "name": "Xã Tùng Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bce43710b9",
        "name": "Xã Tứ Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8abaebfb67",
        "name": "Xã Việt Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7817596cf0",
        "name": "Xã Vũ Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-247e99c8f8",
        "name": "Xã Xuân Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e9fb14910",
        "name": "Xã Yên Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-fefedd7683",
    "name": "Tỉnh Hưng Yên",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-072f31733b",
        "name": "Phường Đường Hào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c1c0eeaa66",
        "name": "Phường Hồng Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-527f466180",
        "name": "Phường Mỹ Hào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f243363970",
        "name": "Phường Phố Hiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac0edabc06",
        "name": "Phường Sơn Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5ff3bba1c3",
        "name": "Phường Thái Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6635d17c52",
        "name": "Phường Thượng Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d139aab07a",
        "name": "Phường Trà Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8045e571a8",
        "name": "Phường Trần Hưng Đạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-38a33f4382",
        "name": "Phường Trần Lãm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-976a2f7e87",
        "name": "Phường Vũ Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-111f88ef9f",
        "name": "Xã A Sào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c353c9e180",
        "name": "Xã Ái Quốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b6d20f6fa",
        "name": "Xã Ân Thi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c69a9fd12b",
        "name": "Xã Bắc Đông Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-71efdd7c13",
        "name": "Xã Bắc Đông Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d6b9b0345",
        "name": "Xã Bắc Thái Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b806bac8e5",
        "name": "Xã Bắc Thụy Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff01569c10",
        "name": "Xã Bắc Tiên Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b7e7ae9c2",
        "name": "Xã Bình Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e7e46093af",
        "name": "Xã Bình Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f0f0ab04e5",
        "name": "Xã Bình Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ddb94f1e40",
        "name": "Xã Châu Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-22f480369d",
        "name": "Xã Chí Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f8b7e7ab6",
        "name": "Xã Diên Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-34c87a9f77",
        "name": "Xã Đại Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c1dd2c8bad",
        "name": "Xã Đoàn Đào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ec31f3868f",
        "name": "Xã Đồng Bằng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83265420c3",
        "name": "Xã Đồng Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a29241750b",
        "name": "Xã Đông Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-256f0ecd85",
        "name": "Xã Đông Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d90143fa01",
        "name": "Xã Đông Thái Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e645c59e98",
        "name": "Xã Đông Thụy Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8b09bd3aa0",
        "name": "Xã Đông Tiền Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc30e26719",
        "name": "Xã Đông Tiên Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c8d50c5ae",
        "name": "Xã Đức Hợp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-31765ee548",
        "name": "Xã Hiệp Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-122a957363",
        "name": "Xã Hoàn Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ea073dac4",
        "name": "Xã Hoàng Hoa Thám",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1914ff7b0",
        "name": "Xã Hồng Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e0c33fae52",
        "name": "Xã Hồng Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a0a48db55",
        "name": "Xã Hồng Vũ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-48843ebf2a",
        "name": "Xã Hưng Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-751a486a3e",
        "name": "Xã Hưng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-322e871a61",
        "name": "Xã Khoái Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3701f91c3f",
        "name": "Xã Kiến Xương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e7c70f3842",
        "name": "Xã Lạc Đạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c0a6e2875b",
        "name": "Xã Lê Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1ebfd5971c",
        "name": "Xã Lê Quý Đôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c0ca182a5b",
        "name": "Xã Long Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-29bb0b1394",
        "name": "Xã Lương Bằng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-61944b4fd6",
        "name": "Xã Mễ Sở",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6d0e8cd80",
        "name": "Xã Minh Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9aecedb3cc",
        "name": "Xã Nam Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed8a4b37b7",
        "name": "Xã Nam Đông Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5b8b1e0197",
        "name": "Xã Nam Thái Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2f4f38044b",
        "name": "Xã Nam Thụy Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d90980f2d3",
        "name": "Xã Nam Tiền Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e8b7de2a43",
        "name": "Xã Nam Tiên Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f06646decd",
        "name": "Xã Nghĩa Dân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-df3afc6e79",
        "name": "Xã Nghĩa Trụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-39fb1006ba",
        "name": "Xã Ngọc Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-68ce81ff97",
        "name": "Xã Nguyễn Du",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-80b65d81a7",
        "name": "Xã Nguyễn Trãi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-334d72eb6f",
        "name": "Xã Nguyễn Văn Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8090eac3e3",
        "name": "Xã Ngự Thiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-17b9242e07",
        "name": "Xã Như Quỳnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e3f51f11b",
        "name": "Xã Phạm Ngũ Lão",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cec585a70f",
        "name": "Xã Phụ Dực",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fe6aed46fb",
        "name": "Xã Phụng Công",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6532782d01",
        "name": "Xã Quang Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7d5f0e55f",
        "name": "Xã Quang Lịch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6896c0132",
        "name": "Xã Quỳnh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d7a65b821",
        "name": "Xã Quỳnh Phụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3dcd37a7e3",
        "name": "Xã Tân Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a445d7ad16",
        "name": "Xã Tân Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-80486ac83c",
        "name": "Xã Tân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-01de737aa0",
        "name": "Xã Tây Thái Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84f64365b6",
        "name": "Xã Tây Thụy Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ebc3b23af6",
        "name": "Xã Tây Tiền Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e8d34a9004",
        "name": "Xã Thái Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6e011efe29",
        "name": "Xã Thái Thụy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27b86a2299",
        "name": "Xã Thần Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a76c6c62f",
        "name": "Xã Thụy Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-199ff7460c",
        "name": "Xã Thư Trì",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-39541391d3",
        "name": "Xã Thư Vũ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-91cf76f4b8",
        "name": "Xã Tiền Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-920717e345",
        "name": "Xã Tiên Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ede24fe1f7",
        "name": "Xã Tiên Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eca245b0ff",
        "name": "Xã Tiên La",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8a00006e33",
        "name": "Xã Tiên Lữ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c31e152ce7",
        "name": "Xã Tiên Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-272ca5e9eb",
        "name": "Xã Tống Trân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-447661c697",
        "name": "Xã Trà Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e1e6a3cbd1",
        "name": "Xã Triệu Việt Vương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d7efa04e42",
        "name": "Xã Vạn Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be9d6902c6",
        "name": "Xã Văn Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d6674df7dc",
        "name": "Xã Việt Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f9915a08c5",
        "name": "Xã Việt Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-112472814f",
        "name": "Xã Vũ Quý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f062b551f",
        "name": "Xã Vũ Thư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-04a7580a4d",
        "name": "Xã Vũ Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa7f134614",
        "name": "Xã Xuân Trúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1360cfab4f",
        "name": "Xã Yên Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-bb3109f1f6",
    "name": "Tỉnh Khánh Hòa",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-d8bb367226",
        "name": "Đặc khu Trường Sa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5a3e7faa9f",
        "name": "Phường Ba Ngòi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-10ecbe3c25",
        "name": "Phường Bảo An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-11e9365135",
        "name": "Phường Bắc Cam Ranh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-569ff3e6c0",
        "name": "Phường Bắc Nha Trang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-31026f18f6",
        "name": "Phường Cam Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-75ca51ac65",
        "name": "Phường Cam Ranh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00d92c1231",
        "name": "Phường Đô Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-052c474ed8",
        "name": "Phường Đông Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9442bbfd86",
        "name": "Phường Đông Ninh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb52caca7a",
        "name": "Phường Hòa Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-02a7a5c9fc",
        "name": "Phường Nam Nha Trang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5fbc9629d6",
        "name": "Phường Nha Trang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00c082a4d5",
        "name": "Phường Ninh Chử",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed5752c915",
        "name": "Phường Ninh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-029cb5d064",
        "name": "Phường Phan Rang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ba5eb470d",
        "name": "Phường Tây Nha Trang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c23024cf4",
        "name": "Xã Anh Dũng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-490cee9713",
        "name": "Xã Bác Ái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a54fda21cc",
        "name": "Xã Bác Ái Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-852f213da3",
        "name": "Xã Bác Ái Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5250156087",
        "name": "Xã Bắc Khánh Vĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b7f55277ca",
        "name": "Xã Bắc Ninh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e3852dbae",
        "name": "Xã Cà Ná",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3822105e93",
        "name": "Xã Cam An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5ee83f9746",
        "name": "Xã Cam Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-93a8c80958",
        "name": "Xã Cam Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5db2a0a416",
        "name": "Xã Công Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c1fc0634c1",
        "name": "Xã Diên Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c294caf72",
        "name": "Xã Diên Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7c3bdd612",
        "name": "Xã Diên Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c035151d98",
        "name": "Xã Diên Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-038e0cb735",
        "name": "Xã Diên Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5f8175f779",
        "name": "Xã Đại Lãnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e89affc74",
        "name": "Xã Đông Khánh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6fa0b2656a",
        "name": "Xã Hòa Trí",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c70569a9b6",
        "name": "Xã Khánh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3cbe06df59",
        "name": "Xã Khánh Vĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb377c658e",
        "name": "Xã Lâm Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab94e0ba05",
        "name": "Xã Mỹ Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-10b1ae415e",
        "name": "Xã Nam Cam Ranh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fc365013c1",
        "name": "Xã Nam Khánh Vĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0462fcbc61",
        "name": "Xã Nam Ninh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-92aff955ad",
        "name": "Xã Ninh Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-45e8a82750",
        "name": "Xã Ninh Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa251365b3",
        "name": "Xã Ninh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9da850b4dd",
        "name": "Xã Phước Dinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-57635fb3b7",
        "name": "Xã Phước Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-492cee6c02",
        "name": "Xã Phước Hậu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e7c088d2a",
        "name": "Xã Phước Hữu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6fd676edb9",
        "name": "Xã Suối Dầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ecd2a33402",
        "name": "Xã Suối Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-39de5aefc1",
        "name": "Xã Tân Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c7bad3456f",
        "name": "Xã Tây Khánh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-af90e94127",
        "name": "Xã Tây Khánh Vĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e27d413db",
        "name": "Xã Tây Ninh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bad86c2356",
        "name": "Xã Thuận Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-548df91d47",
        "name": "Xã Thuận Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a49e168b3",
        "name": "Xã Trung Khánh Vĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e452f0b38",
        "name": "Xã Tu Bông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-52c7db2bfe",
        "name": "Xã Vạn Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ddc2b9cabc",
        "name": "Xã Vạn Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a31b4212ee",
        "name": "Xã Vạn Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9483fed396",
        "name": "Xã Vĩnh Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c66d4fd28",
        "name": "Xã Xuân Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-c1d5fb9bf6",
    "name": "Tỉnh Lai Châu",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-fd060f5ed2",
        "name": "Phường Đoàn Kết",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ce61e746c",
        "name": "Phường Tân Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-09860f9f9f",
        "name": "Xã Bản Bo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4f88068e8e",
        "name": "Xã Bình Lư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b28f0e0fc",
        "name": "Xã Bum Nưa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e8247a56a",
        "name": "Xã Bum Tở",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1ba76a6dec",
        "name": "Xã Dào San",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d378812e77",
        "name": "Xã Hồng Thu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bef8115a4f",
        "name": "Xã Hua Bum",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4fd9b4f5b5",
        "name": "Xã Khoen On",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-86747d0376",
        "name": "Xã Khổng Lào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b57684e74b",
        "name": "Xã Khun Há",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f943346ccb",
        "name": "Xã Lê Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2eab528644",
        "name": "Xã Mù Cả",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1eb8d80c44",
        "name": "Xã Mường Khoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cb3538e601",
        "name": "Xã Mường Kim",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b4effba1dd",
        "name": "Xã Mường Mô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed6198c6c0",
        "name": "Xã Mường Tè",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-131662f5c5",
        "name": "Xã Mường Than",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e00e6a789",
        "name": "Xã Nậm Cuổi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b495963dbb",
        "name": "Xã Nậm Hàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9bb1fbe62c",
        "name": "Xã Nậm Mạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3282969f4b",
        "name": "Xã Nậm Sỏ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-088cf23867",
        "name": "Xã Nậm Tăm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf8c00514e",
        "name": "Xã Pa Tần",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d7e741409a",
        "name": "Xã Pa Ủ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0717cde067",
        "name": "Xã Pắc Ta",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd588120e6",
        "name": "Xã Phong Thổ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f36d2b0300",
        "name": "Xã Pu Sam Cáp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7267d816ff",
        "name": "Xã Sì Lở Lầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f514bfd1e5",
        "name": "Xã Sìn Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fd5827e5a8",
        "name": "Xã Sin Suối Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83d42caf7e",
        "name": "Xã Tả Lèng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-65f0fb63b4",
        "name": "Xã Tà Tổng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c13157c2ec",
        "name": "Xã Tân Uyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1768d6c20f",
        "name": "Xã Than Uyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-461e76230e",
        "name": "Xã Thu Lũm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e98f4c85e",
        "name": "Xã Tủa Sín Chải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-c75f4b59d1",
    "name": "Tỉnh Lạng Sơn",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-ec8ae7086b",
        "name": "Phường Đông Kinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e494286ca4",
        "name": "Phường Kỳ Lừa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f08479b282",
        "name": "Phường Lương Văn Tri",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67ddf69c5e",
        "name": "Phường Tam Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a735bde131",
        "name": "Xã Ba Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bfbb7a569d",
        "name": "Xã Bắc Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d137d9f66d",
        "name": "Xã Bằng Mạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5d2a27a151",
        "name": "Xã Bình Gia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-46d5071c88",
        "name": "Xã Cai Kinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a260cf77e1",
        "name": "Xã Cao Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-16d32ad6a1",
        "name": "Xã Châu Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-da423b1f50",
        "name": "Xã Chi Lăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c46c180b8",
        "name": "Xã Chiến Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e7e8a4afb",
        "name": "Xã Công Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b0759455b",
        "name": "Xã Điềm He",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e3edfeefa7",
        "name": "Xã Đình Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-814ee42a39",
        "name": "Xã Đoàn Kết",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4609632ba8",
        "name": "Xã Đồng Đăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0dd836a623",
        "name": "Xã Hoa Thám",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-399fb3c77a",
        "name": "Xã Hoàng Văn Thụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f12129d4a",
        "name": "Xã Hội Hoan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8cee5344f9",
        "name": "Xã Hồng Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8b48cacd49",
        "name": "Xã Hưng Vũ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9999de9d5f",
        "name": "Xã Hữu Liên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87356941c4",
        "name": "Xã Hữu Lũng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa3bf28c8b",
        "name": "Xã Kháng Chiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7568a8d5b4",
        "name": "Xã Khánh Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9334c94035",
        "name": "Xã Khuất Xá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eaeee30d24",
        "name": "Xã Kiên Mộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-449e20bbce",
        "name": "Xã Lộc Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9e48dcb85",
        "name": "Xã Lợi Bác",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c08fa22a24",
        "name": "Xã Mẫu Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2803992dac",
        "name": "Xã Na Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e2a9b661c",
        "name": "Xã Na Sầm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-70b2da7a95",
        "name": "Xã Nhân Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bd4b23d3e7",
        "name": "Xã Nhất Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15a05ff78c",
        "name": "Xã Quan Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-052d3ea018",
        "name": "Xã Quốc Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa7c344b4d",
        "name": "Xã Quốc Việt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f57f34ef17",
        "name": "Xã Quý Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2d9e1c456d",
        "name": "Xã Tân Đoàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5512d25077",
        "name": "Xã Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad4812d264",
        "name": "Xã Tân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-41785a40d5",
        "name": "Xã Tân Tri",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-21994630f5",
        "name": "Xã Tân Văn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8bb96ba741",
        "name": "Xã Thái Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b408024b94",
        "name": "Xã Thất Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b4f45ab9ac",
        "name": "Xã Thiện Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a7b3d9b5a",
        "name": "Xã Thiện Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ba84d80169",
        "name": "Xã Thiện Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-524de08e98",
        "name": "Xã Thiện Thuật",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9b92bce4bc",
        "name": "Xã Thống Nhất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2ef943c87",
        "name": "Xã Thụy Hùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d31c5b306a",
        "name": "Xã Tràng Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-111ce29c9f",
        "name": "Xã Tri Lễ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-590a5586bb",
        "name": "Xã Tuấn Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-51d5fc38b5",
        "name": "Xã Vạn Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e722e4552d",
        "name": "Xã Văn Lãng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-283295bfad",
        "name": "Xã Văn Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9514b19afd",
        "name": "Xã Vân Nham",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f9e04389f3",
        "name": "Xã Vũ Lăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b753332a4a",
        "name": "Xã Vũ Lễ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-993c5a94a1",
        "name": "Xã Xuân Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7c60862c4",
        "name": "Xã Yên Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b32ee948f3",
        "name": "Xã Yên Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-2839ba2179",
    "name": "Tỉnh Lào Cai",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-f3e5cb173a",
        "name": "Phường Âu Lâu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f57e99657",
        "name": "Phường Cam Đường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b2f122a7c8",
        "name": "Phường Cầu Thia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cb154ab75e",
        "name": "Phường Lào Cai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-59ebaf669f",
        "name": "Phường Nam Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4977615584",
        "name": "Phường Nghĩa Lộ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d88505b494",
        "name": "Phường Sa Pa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-963c144367",
        "name": "Phường Trung Tâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0459cc3044",
        "name": "Phường Văn Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6854c477d0",
        "name": "Phường Yên Bái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb5f5590f8",
        "name": "Xã A Mú Sung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3f43a16c01",
        "name": "Xã Bản Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f45411701",
        "name": "Xã Bản Lầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ae21f6939",
        "name": "Xã Bản Liền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3c7c668a0c",
        "name": "Xã Bản Xèo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-57a9a98be0",
        "name": "Xã Bảo Ái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ecc34f3432",
        "name": "Xã Bảo Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28c43d95da",
        "name": "Xã Bảo Nhai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-70f5091cfa",
        "name": "Xã Bảo Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6bf0b6d5de",
        "name": "Xã Bảo Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0403f8509f",
        "name": "Xã Bát Xát",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c8c5f9ccc",
        "name": "Xã Bắc Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1db0033e8",
        "name": "Xã Cảm Nhân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8110d9e9e0",
        "name": "Xã Cao Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dba4969bf9",
        "name": "Xã Cát Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ef8e77805c",
        "name": "Xã Chấn Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76e01eba0c",
        "name": "Xã Châu Quế",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c6d175051",
        "name": "Xã Chế Tạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f0b8572c57",
        "name": "Xã Chiềng Ken",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6eabc4706",
        "name": "Xã Cốc Lầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-547c016740",
        "name": "Xã Cốc San",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b07b38dec",
        "name": "Xã Dền Sáng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99bd06ce7d",
        "name": "Xã Dương Quỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e8691cf536",
        "name": "Xã Đông Cuông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d25c26ad2",
        "name": "Xã Gia Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e226e3a2b",
        "name": "Xã Gia Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bf267d6acc",
        "name": "Xã Hạnh Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a653dc4356",
        "name": "Xã Hợp Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-57b3e9f57e",
        "name": "Xã Hưng Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1087f79dc",
        "name": "Xã Khánh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5f810dbb19",
        "name": "Xã Khánh Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e8f981b03",
        "name": "Xã Khao Mang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a9c7014105",
        "name": "Xã Lao Chải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e8d0eb1f2b",
        "name": "Xã Lâm Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-73949f6328",
        "name": "Xã Lâm Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c85b0ad1a4",
        "name": "Xã Liên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6549ff2a87",
        "name": "Xã Lục Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3902e43d80",
        "name": "Xã Lùng Phình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f296a5bb75",
        "name": "Xã Lương Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab3e8d4bcd",
        "name": "Xã Mậu A",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3c40f0e88c",
        "name": "Xã Minh Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cdbb86b9db",
        "name": "Xã Mỏ Vàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4aceca08e3",
        "name": "Xã Mù Cang Chải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-09f45ada5e",
        "name": "Xã Mường Bo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a3c10061f",
        "name": "Xã Mường Hum",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2d2620cb67",
        "name": "Xã Mường Khương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b0f84fe964",
        "name": "Xã Mường Lai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-02eb577a0c",
        "name": "Xã Nậm Chày",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a503f9c3b4",
        "name": "Xã Nậm Có",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cb2d5cab76",
        "name": "Xã Nậm Xé",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-079e3f0823",
        "name": "Xã Nghĩa Đô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1003ed330b",
        "name": "Xã Nghĩa Tâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-40699ee734",
        "name": "Xã Ngũ Chỉ Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67ec0165a2",
        "name": "Xã Pha Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e82a7140e4",
        "name": "Xã Phình Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6628fda289",
        "name": "Xã Phong Dụ Hạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7fdc288e6a",
        "name": "Xã Phong Dụ Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0043b4329d",
        "name": "Xã Phong Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-788d366b18",
        "name": "Xã Phúc Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ba2c6304e1",
        "name": "Xã Phúc Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9312ed9e44",
        "name": "Xã Púng Luông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e962d4f77",
        "name": "Xã Quy Mông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-efd71011a7",
        "name": "Xã Si Ma Cai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e07b04bf6d",
        "name": "Xã Sín Chéng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6145954524",
        "name": "Xã Sơn Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc778a3e1c",
        "name": "Xã Tả Củ Tỷ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e373fccdb4",
        "name": "Xã Tả Phìn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-97a73e0f3e",
        "name": "Xã Tả Van",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a75f60f3b7",
        "name": "Xã Tà Xi Láng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6d43503ea3",
        "name": "Xã Tằng Loỏng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c61590c7f",
        "name": "Xã Tân Hợp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2bac75dc7",
        "name": "Xã Tân Lĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e27dbeabca",
        "name": "Xã Thác Bà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6269a0317e",
        "name": "Xã Thượng Bằng La",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e84583bce",
        "name": "Xã Thượng Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-01cf706a0e",
        "name": "Xã Trạm Tấu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f42e4669e7",
        "name": "Xã Trấn Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03ecd2f57b",
        "name": "Xã Trịnh Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85d04002b1",
        "name": "Xã Tú Lệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e38d56751",
        "name": "Xã Văn Bàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d316b8730",
        "name": "Xã Văn Chấn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c5354f91e8",
        "name": "Xã Việt Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8309ac21d7",
        "name": "Xã Võ Lao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99ae073c60",
        "name": "Xã Xuân Ái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-358990064a",
        "name": "Xã Xuân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc11f14423",
        "name": "Xã Xuân Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-750a5765dd",
        "name": "Xã Y Tý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-69b27397c0",
        "name": "Xã Yên Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fd3d4b794e",
        "name": "Xã Yên Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-1292843a6f",
    "name": "Tỉnh Lâm Đồng",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-0d4808d886",
        "name": "Đặc khu Phú Quý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d615e3c64",
        "name": "Phường 1 Bảo Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c147de213",
        "name": "Phường 2 Bảo Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-70c6ccff07",
        "name": "Phường 3 Bảo Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-defd5c5911",
        "name": "Phường B’Lao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9678a56436",
        "name": "Phường Bắc Gia Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ceb96091f",
        "name": "Phường Bình Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c43c612f9",
        "name": "Phường Cam Ly - Đà Lạt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4aff96b705",
        "name": "Phường Đông Gia Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-df14b308b2",
        "name": "Phường Hàm Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b89418a4d",
        "name": "Phường La Gi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bedad99685",
        "name": "Phường Lang Biang - Đà Lạt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-57f0e6f066",
        "name": "Phường Lâm Viên - Đà Lạt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aad8b32202",
        "name": "Phường Mũi Né",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-61e858f626",
        "name": "Phường Nam Gia Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-758d9f9cde",
        "name": "Phường Phan Thiết",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1222cc3ec",
        "name": "Phường Phú ThủY",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0dc53c02ff",
        "name": "Phường Phước Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9963f7501",
        "name": "Phường Tiến Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83babf15c2",
        "name": "Phường Xuân Hương - Đà Lạt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f38c26397d",
        "name": "Phường Xuân Trường - Đà Lạt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-13d33c0ea2",
        "name": "Xã Bảo Lâm 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad6bbac3d8",
        "name": "Xã Bảo Lâm 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00a7e267d9",
        "name": "Xã Bảo Lâm 3",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ace9b0ef9e",
        "name": "Xã Bảo Lâm 4",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d631e03b3f",
        "name": "Xã Bảo Lâm 5",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ba967584b",
        "name": "Xã Bảo Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b7c7e0403d",
        "name": "Xã Bắc Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a524fbd79e",
        "name": "Xã Bắc Ruộng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0e8173e513",
        "name": "Xã Cát Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f697a7246d",
        "name": "Xã Cát Tiên 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2430a47fa7",
        "name": "Xã Cát Tiên 3",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-066bce65f5",
        "name": "Xã Cư Jút",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2cdf91aa29",
        "name": "Xã D'Ran",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e064855875",
        "name": "Xã Di Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2f8e80156e",
        "name": "Xã Đạ Huoai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc44ce9452",
        "name": "Xã Đạ Huoai 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6f4ae6f0d0",
        "name": "Xã Đạ Huoai 3",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eb5dde68a3",
        "name": "Xã Đạ Tẻh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e1b4bdcd5",
        "name": "Xã Đạ Tẻh 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b58c3819a2",
        "name": "Xã Đạ Tẻh 3",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-916de813e2",
        "name": "Xã Đam Rông 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ebe947216",
        "name": "Xã Đam Rông 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ebdc77d871",
        "name": "Xã Đam Rông 3",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a39a553d79",
        "name": "Xã Đam Rông 4",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b6c5537afe",
        "name": "Xã Đắk Mil",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6936f3a90d",
        "name": "Xã Đắk Sắk",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-30beae79a6",
        "name": "Xã Đắk Song",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ae159261c",
        "name": "Xã Đắk Wil",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e007da335d",
        "name": "Xã Đinh Trang Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-10d1957d9f",
        "name": "Xã Đinh Văn Lâm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-33e42c4894",
        "name": "Xã Đông Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c669684ed",
        "name": "Xã Đồng Kho",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-89fbdb117d",
        "name": "Xã Đơn Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc320cafce",
        "name": "Xã Đức An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a8dddcb28f",
        "name": "Xã Đức Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ccb990c88d",
        "name": "Xã Đức Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ceb4f5182",
        "name": "Xã Đức Trọng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b2e5162ba8",
        "name": "Xã Gia Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27ad438278",
        "name": "Xã Hải Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-efe23bc1b0",
        "name": "Xã Hàm Kiệm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3f915d41b2",
        "name": "Xã Hàm Liêm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fd29484d6d",
        "name": "Xã Hàm Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e5a479c3d",
        "name": "Xã Hàm Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c02bf1956c",
        "name": "Xã Hàm Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b51ea6a812",
        "name": "Xã Hàm Thuận Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc8bd6f9ff",
        "name": "Xã Hàm Thuận Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ee78e72bb",
        "name": "Xã Hiệp Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-739a009f2f",
        "name": "Xã Hòa Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28287e0e10",
        "name": "Xã Hòa Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f0aacd2eab",
        "name": "Xã Hòa Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ea20ea698",
        "name": "Xã Hoài Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b12ba5a066",
        "name": "Xã Hồng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ea710a5ce9",
        "name": "Xã Hồng Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac0fdb0972",
        "name": "Xã Ka Đô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1d32c7b476",
        "name": "Xã Kiến Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb921bc32f",
        "name": "Xã Krông Nô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cdadb58914",
        "name": "Xã La Dạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-034a385fd9",
        "name": "Xã Lạc Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf55abe84b",
        "name": "Xã Liên Hương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e0bccbe48",
        "name": "Xã Lương Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-696ad59739",
        "name": "Xã Nam Ban Lâm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0af47a75dd",
        "name": "Xã Nam Dong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c4c995d180",
        "name": "Xã Nam Đà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d0d94e114b",
        "name": "Xã Nam Hà Lâm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-490c30a85d",
        "name": "Xã Nam Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab3c0c99c0",
        "name": "Xã Nâm Nung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-da91733636",
        "name": "Xã Nghị Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1dc8d91496",
        "name": "Xã Nhân Cơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7bcc00650f",
        "name": "Xã Ninh Gia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64471f8de3",
        "name": "Xã Phan Rí Cửa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9934a88e05",
        "name": "Xã Phan Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3f4ff7b320",
        "name": "Xã Phú Sơn Lâm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ae266ff9d",
        "name": "Xã Phúc Thọ Lâm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca6037de3c",
        "name": "Xã Quảng Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4515b273ce",
        "name": "Xã Quảng Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-312adc697d",
        "name": "Xã Quảng Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff5f0a69c3",
        "name": "Xã Quảng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c01092dcde",
        "name": "Xã Quảng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-116d90e965",
        "name": "Xã Quảng Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e1734e8179",
        "name": "Xã Quảng Tín",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3bb37f6271",
        "name": "Xã Quảng Trực",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-964e9689d5",
        "name": "Xã Sông Lũy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e5af60685",
        "name": "Xã Sơn Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bdb6667e64",
        "name": "Xã Sơn Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e75f31a4c7",
        "name": "Xã Suối Kiết",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e85459fe40",
        "name": "Xã Tà Đùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5fd9334572",
        "name": "Xã Tà Hine",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1b89c08b74",
        "name": "Xã Tà Năng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c91ead3cd",
        "name": "Xã Tánh Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-16a878a1be",
        "name": "Xã Tân Hà Lâm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8249c8127f",
        "name": "Xã Tân Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4df4ea62e0",
        "name": "Xã Tân Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc34d94216",
        "name": "Xã Tân Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d2cb8160a9",
        "name": "Xã Tân Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9cccc08e4",
        "name": "Xã Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-45b9d3ed65",
        "name": "Xã Thuận An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f13909f88c",
        "name": "Xã Thuận Hạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f3d23b281",
        "name": "Xã Trà Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6412a10530",
        "name": "Xã Trường Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60f142c8e9",
        "name": "Xã Tuy Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7b6a39904",
        "name": "Xã Tuy Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-54f15afc05",
        "name": "Xã Tuyên Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b974ce7f37",
        "name": "Xã Vĩnh Hảo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-0712458730",
    "name": "Tỉnh Nghệ An",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-5834439f62",
        "name": "Phường Cửa Lò",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb7b0804dd",
        "name": "Phường Hoàng Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67c368cb29",
        "name": "Phường Quỳnh Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca1b69ac1d",
        "name": "Phường Tân Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4fadc6d02e",
        "name": "Phường Tây Hiếu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a3ff45aa21",
        "name": "Phường Thái Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-678bc3d346",
        "name": "Phường Thành Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ecb1e4b9ec",
        "name": "Phường Trường Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5da012c1f1",
        "name": "Phường Vinh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a901b11e34",
        "name": "Phường Vinh Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d2231c34b",
        "name": "Phường Vinh Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-966768cab9",
        "name": "Xã An Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-11a31bfbe2",
        "name": "Xã Anh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-faf32b5d86",
        "name": "Xã Anh Sơn Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a76b9841dc",
        "name": "Xã Bạch Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c91d1bd86c",
        "name": "Xã Bạch Ngọc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-154a52cbcb",
        "name": "Xã Bắc Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-41e156cb83",
        "name": "Xã Bích Hào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b156180ba0",
        "name": "Xã Bình Chuẩn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-717a06696a",
        "name": "Xã Bình Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-78cca69640",
        "name": "Xã Cam Phục",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-de361711a7",
        "name": "Xã Cát Ngạn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c1096895a",
        "name": "Xã Châu Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f9356e61fe",
        "name": "Xã Châu Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-757bbe5e77",
        "name": "Xã Châu Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c25ff8fc71",
        "name": "Xã Châu Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f67f140cc2",
        "name": "Xã Châu Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b5f060d680",
        "name": "Xã Chiêu Lưu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bfe7ebc5b1",
        "name": "Xã Con Cuông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8f30817531",
        "name": "Xã Diễn Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab7eb254f8",
        "name": "Xã Đại Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ff3223151",
        "name": "Xã Đại Huệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ee06b8325c",
        "name": "Xã Đô Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7a08c83c0",
        "name": "Xã Đông Hiếu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fedef523a1",
        "name": "Xã Đông Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dccb435f01",
        "name": "Xã Đông Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b2e8f5de08",
        "name": "Xã Đức Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03607bf4bf",
        "name": "Xã Giai Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99ec7c1c75",
        "name": "Xã Giai Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c03050e42",
        "name": "Xã Hải Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f9d1de39a8",
        "name": "Xã Hải Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-13983dcac9",
        "name": "Xã Hạnh Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d8fb294a5b",
        "name": "Xã Hoa Quân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85df1b6313",
        "name": "Xã Hợp Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-89150aff9f",
        "name": "Xã Hùng Chân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d58cb1d0f7",
        "name": "Xã Hùng Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b12f698a73",
        "name": "Xã Huồi Tụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6614f78f83",
        "name": "Xã Hưng Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5f9036281b",
        "name": "Xã Hưng Nguyên Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-25afde8eb6",
        "name": "Xã Hữu Khuông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a1741cd742",
        "name": "Xã Hữu Kiệm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d426d8e7bc",
        "name": "Xã Keng Đu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0b74bf3d06",
        "name": "Xã Kim Bảng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-81d57d1901",
        "name": "Xã Kim Liên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5225decf47",
        "name": "Xã Lam Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d0129f3df7",
        "name": "Xã Lượng Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e7049a38f6",
        "name": "Xã Lương Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ffd683dfd",
        "name": "Xã Mậu Thạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-10f08ea09b",
        "name": "Xã Minh Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed9622efd9",
        "name": "Xã Minh Hợp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eeffd2e7e4",
        "name": "Xã Môn Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc70691a57",
        "name": "Xã Mường Chọng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1c691a4a90",
        "name": "Xã Mường Ham",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-497fb665ac",
        "name": "Xã Mường Lống",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ff0357b10",
        "name": "Xã Mường Quàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c336f14f92",
        "name": "Xã Mường Típ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-442160b695",
        "name": "Xã Mường Xén",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c4ed1587d",
        "name": "Xã Mỹ Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e2d3cb0ece",
        "name": "Xã Na Loi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9c1c126dc",
        "name": "Xã Na Ngoi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc8a07e345",
        "name": "Xã Nam Đàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-862de13938",
        "name": "Xã Nậm Cắn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0de69a40fe",
        "name": "Xã Nga My",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b0dd48bab",
        "name": "Xã Nghi Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-11d914c228",
        "name": "Xã Nghĩa Đàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6430598c72",
        "name": "Xã Nghĩa Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-289dc7b444",
        "name": "Xã Nghĩa Hành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e17b304b1e",
        "name": "Xã Nghĩa Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e5df7100e",
        "name": "Xã Nghĩa Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c8848e675f",
        "name": "Xã Nghĩa Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1db3c93fef",
        "name": "Xã Nghĩa Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f8eccfca40",
        "name": "Xã Nghĩa Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15849e0c62",
        "name": "Xã Nghĩa Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-70f636f7b7",
        "name": "Xã Nhân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d49f044d06",
        "name": "Xã Nhôn Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8027ff91a3",
        "name": "Xã Phúc Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5fad482937",
        "name": "Xã Quan Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b926c9a97",
        "name": "Xã Quảng Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-791b71533f",
        "name": "Xã Quang Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-458463dd10",
        "name": "Xã Quế Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2dc01b485",
        "name": "Xã Quỳ Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf4f0be842",
        "name": "Xã Quỳ Hợp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3584ad62df",
        "name": "Xã Quỳnh Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-94d5e6082f",
        "name": "Xã Quỳnh Lưu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-147e3525bb",
        "name": "Xã Quỳnh Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3774ddc33c",
        "name": "Xã Quỳnh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd444fb2b6",
        "name": "Xã Quỳnh Tam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-331cf661bd",
        "name": "Xã Quỳnh Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f55c298bc",
        "name": "Xã Quỳnh Văn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-18e7f9049e",
        "name": "Xã Sơn Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d737800460",
        "name": "Xã Tam Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a0b1f1722",
        "name": "Xã Tam Hợp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-868db5ff6f",
        "name": "Xã Tam Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e989d695bc",
        "name": "Xã Tam Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8498a0f306",
        "name": "Xã Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0b5165377b",
        "name": "Xã Tân Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-425ab005a3",
        "name": "Xã Tân Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e30e2a1e39",
        "name": "Xã Tân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e8f414e243",
        "name": "Xã Thành Bình Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-86620f36d7",
        "name": "Xã Thần Lĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32f9e50cc7",
        "name": "Xã Thiên Nhẫn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2dad801e27",
        "name": "Xã Thông Thụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fcd517fb5e",
        "name": "Xã Thuần Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc4f521d5b",
        "name": "Xã Tiên Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-40076d3dbe",
        "name": "Xã Tiền Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1a2fe90672",
        "name": "Xã Tri Lễ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-72fbe2ab5f",
        "name": "Xã Trung Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eb34246536",
        "name": "Xã Tương Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-707a2bcc3a",
        "name": "Xã Vạn An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0bfbbd7420",
        "name": "Xã Văn Hiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa8a88cff4",
        "name": "Xã Văn Kiều",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bcfb25d5c1",
        "name": "Xã Vân Du",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d4d3c8709d",
        "name": "Xã Vân Tụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b77dcb272",
        "name": "Xã Vĩnh Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f4d5acc00e",
        "name": "Xã Xuân Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0bc5cc07d3",
        "name": "Xã Yên Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-208a9b683e",
        "name": "Xã Yên Na",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c77bb025f7",
        "name": "Xã Yên Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-98c212af58",
        "name": "Xã Yên Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c7113b546b",
        "name": "Xã Yên Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-c0870c2a43",
    "name": "Tỉnh Ninh Bình",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-59a076a398",
        "name": "Phường Châu Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a3d8b56a02",
        "name": "Phường Duy Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2d16900a57",
        "name": "Phường Duy Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-084328e234",
        "name": "Phường Duy Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9bed28d447",
        "name": "Phường Đông A",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-159cb9c00a",
        "name": "Phường Đông Hoa Lư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c48137e253",
        "name": "Phường Đồng Văn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e26ba5e2b3",
        "name": "Phường Hà Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-45646015db",
        "name": "Phường Hoa Lư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6e82e010c",
        "name": "Phường Hồng Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-93561da6be",
        "name": "Phường Kim Bảng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-82264e7fb9",
        "name": "Phường Kim Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed3da7268a",
        "name": "Phường Lê Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa494a87be",
        "name": "Phường Liêm Tuyền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cfd06b8fcc",
        "name": "Phường Lý Thường Kiệt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6ab3dbe21a",
        "name": "Phường Mỹ Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-712f1fa52e",
        "name": "Phường Nam Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7216f3a84f",
        "name": "Phường Nam Hoa Lư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-572f8625d0",
        "name": "Phường Nguyễn Úy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d24a2892f6",
        "name": "Phường Phủ Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dae12d03b7",
        "name": "Phường Phù Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b4c40783f6",
        "name": "Phường Tam Chúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-838f3e45e7",
        "name": "Phường Tam Điệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-768a0378e5",
        "name": "Phường Tây Hoa Lư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-819f6801ec",
        "name": "Phường Thành Nam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa0e370a1d",
        "name": "Phường Thiên Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2139a32ab1",
        "name": "Phường Tiên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84b5e75d4c",
        "name": "Phường Trung Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-faededf468",
        "name": "Phường Trường Thi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-104474a8b4",
        "name": "Phường Vị Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a881cd984e",
        "name": "Phường Yên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a488d80a1a",
        "name": "Phường Yên Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-218045a2c5",
        "name": "Xã Bắc Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1dd6ae25b",
        "name": "Xã Bình An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-94c32c69a1",
        "name": "Xã Bình Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1ba1b2a281",
        "name": "Xã Bình Lục",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-247ee84535",
        "name": "Xã Bình Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d5840541de",
        "name": "Xã Bình Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c963ab48b",
        "name": "Xã Bình Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca13f21056",
        "name": "Xã Cát Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-36e9e1f519",
        "name": "Xã Chất Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-36a0772084",
        "name": "Xã Cổ Lễ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b04fd1616a",
        "name": "Xã Cúc Phương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d8f6e5e4b",
        "name": "Xã Đại Hoàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4a5c543988",
        "name": "Xã Định Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6ba23afa8c",
        "name": "Xã Đồng Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e807d76f6",
        "name": "Xã Đồng Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-62f6673d93",
        "name": "Xã Gia Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e9928683f",
        "name": "Xã Gia Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8028b39e7d",
        "name": "Xã Gia Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e0b527f1d",
        "name": "Xã Gia Trấn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bec797da75",
        "name": "Xã Gia Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-93f2c974c7",
        "name": "Xã Gia Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32401214e8",
        "name": "Xã Gia Viễn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3da01c0437",
        "name": "Xã Giao Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8c6df0228c",
        "name": "Xã Giao Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-43fa169622",
        "name": "Xã Giao Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a90e422bbe",
        "name": "Xã Giao Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20adbd17fc",
        "name": "Xã Giao Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eee78c6f1f",
        "name": "Xã Giao Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-25d621d924",
        "name": "Xã Giao Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1d3314483d",
        "name": "Xã Hải An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c1983d65a5",
        "name": "Xã Hải Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6aac9f50e0",
        "name": "Xã Hải Hậu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d5a585dbae",
        "name": "Xã Hải Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7c6a9e7ee2",
        "name": "Xã Hải Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b6e27b00b7",
        "name": "Xã Hải Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f48fbfa276",
        "name": "Xã Hải Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00dcbc3475",
        "name": "Xã Hải Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b73ed57669",
        "name": "Xã Hiển Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-413fb62789",
        "name": "Xã Hồng Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-75724c82ad",
        "name": "Xã Khánh Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-38652edf45",
        "name": "Xã Khánh Nhạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d9a3cb9fc",
        "name": "Xã Khánh Thiện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-93289e6402",
        "name": "Xã Khánh Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-317caab01f",
        "name": "Xã Kim Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d36843099",
        "name": "Xã Kim Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5fdf1160a0",
        "name": "Xã Lai Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aeb36079bf",
        "name": "Xã Liêm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-df224ef2b8",
        "name": "Xã Liên Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-175eaccf8e",
        "name": "Xã Lý Nhân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c8da70c04",
        "name": "Xã Minh Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f1cae1fb3e",
        "name": "Xã Minh Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad2e4ae602",
        "name": "Xã Nam Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9703b8e6f0",
        "name": "Xã Nam Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f91cb32d4",
        "name": "Xã Nam Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f46212adab",
        "name": "Xã Nam Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-398efa2834",
        "name": "Xã Nam Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-60e6f90a52",
        "name": "Xã Nam Trực",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5abea6c090",
        "name": "Xã Nam Xang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b6e781084b",
        "name": "Xã Nghĩa Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e73e181c4b",
        "name": "Xã Nghĩa Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15ade4a244",
        "name": "Xã Nghĩa Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c0d2fd7c5",
        "name": "Xã Nhân Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fe96bb1461",
        "name": "Xã Nho Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a1bd3e2fa",
        "name": "Xã Ninh Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ddedd630f4",
        "name": "Xã Ninh Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c6067412c3",
        "name": "Xã Phát Diệm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0512abba3a",
        "name": "Xã Phong Doanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ead0a32b88",
        "name": "Xã Phú Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-392060a0c6",
        "name": "Xã Phú Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-958de35368",
        "name": "Xã Quang Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3f317a6666",
        "name": "Xã Quang Thiện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a016887e11",
        "name": "Xã Quỹ Nhất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-213d63990b",
        "name": "Xã Quỳnh Lưu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb05eb051d",
        "name": "Xã Rạng Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6ad716a5e4",
        "name": "Xã Tân Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-060fdd80ad",
        "name": "Xã Tân Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b5443c53d",
        "name": "Xã Thanh Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3da5d66d7f",
        "name": "Xã Thanh Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ffd1ae6d0",
        "name": "Xã Thanh Liêm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e52cf6d39",
        "name": "Xã Thanh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c8dd724fe0",
        "name": "Xã Trần Thương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0b1ad11641",
        "name": "Xã Trực Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ce72349d3",
        "name": "Xã Vạn Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ecb94fae2",
        "name": "Xã Vĩnh Trụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99332db2f7",
        "name": "Xã Vụ Bản",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a4caf6f6a4",
        "name": "Xã Vũ Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c0157d446",
        "name": "Xã Xuân Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b0c852661a",
        "name": "Xã Xuân Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7279dc3743",
        "name": "Xã Xuân Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d97fecfabe",
        "name": "Xã Xuân Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f052625b96",
        "name": "Xã Ý Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6302ea6a85",
        "name": "Xã Yên Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e12abca8b2",
        "name": "Xã Yên Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-80f222976c",
        "name": "Xã Yên Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3182171517",
        "name": "Xã Yên Mạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ccc6378ef8",
        "name": "Xã Yên Mô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c0446abe61",
        "name": "Xã Yên Từ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-1dd1db4798",
    "name": "Tỉnh Phú Thọ",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-3e14c581c1",
        "name": "Phường Âu Cơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8290cbfc18",
        "name": "Phường Hòa Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96ead472f5",
        "name": "Phường Kỳ Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a6b199025c",
        "name": "Phường Nông Trang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8993067495",
        "name": "Phường Phong Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db963175c3",
        "name": "Phường Phú Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dada4ee21d",
        "name": "Phường Phúc Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50195184d5",
        "name": "Phường Tân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-681ff7b423",
        "name": "Phường Thanh Miếu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-59ecaccb1a",
        "name": "Phường Thống Nhất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50530dc8ff",
        "name": "Phường Vân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-94cdedcdf7",
        "name": "Phường Việt Trì",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2a9678c84",
        "name": "Phường Vĩnh Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-42d2902095",
        "name": "Phường Vĩnh Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-43699a06f9",
        "name": "Phường Xuân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-990349f1ee",
        "name": "Xã An Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e60315384",
        "name": "Xã An Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be1e66dd1e",
        "name": "Xã Bản Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-caacad5a4f",
        "name": "Xã Bao La",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc9ad0b24b",
        "name": "Xã Bằng Luân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8cb291d640",
        "name": "Xã Bình Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84eb704b0b",
        "name": "Xã Bình Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fcff1aeb03",
        "name": "Xã Bình Tuyền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9908bb804f",
        "name": "Xã Bình Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-36c4785b20",
        "name": "Xã Cao Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-13eb39342d",
        "name": "Xã Cao Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e46256fdb8",
        "name": "Xã Cao Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23af59a122",
        "name": "Xã Cẩm Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6561db43a3",
        "name": "Xã Chân Mộng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a7beed35b",
        "name": "Xã Chí Đám",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a787db425",
        "name": "Xã Chí Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d54e71e697",
        "name": "Xã Cự Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e7757b6ac2",
        "name": "Xã Dân Chủ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-035a7952cf",
        "name": "Xã Dũng Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9bc56f0bdb",
        "name": "Xã Đà Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e4d755bd78",
        "name": "Xã Đại Đình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-90c6fe58d8",
        "name": "Xã Đại Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1aa6e17def",
        "name": "Xã Đan Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-91b0536df4",
        "name": "Xã Đạo Trù",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8244b11780",
        "name": "Xã Đào Xá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9944adee56",
        "name": "Xã Đoan Hùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7fcc8c3ae7",
        "name": "Xã Đồng Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ba34676bd",
        "name": "Xã Đông Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-56fc2a3838",
        "name": "Xã Đức Nhàn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-39453a6052",
        "name": "Xã Hạ Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-abce2d6141",
        "name": "Xã Hải Lựu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5b30c96aad",
        "name": "Xã Hiền Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5534368feb",
        "name": "Xã Hiền Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fb2e4aaeeb",
        "name": "Xã Hoàng An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-93155d6c2e",
        "name": "Xã Hoàng Cương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf0d7b79fc",
        "name": "Xã Hội Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6fe5416b09",
        "name": "Xã Hợp Kim",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ba40d1b29",
        "name": "Xã Hợp Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a70e4fc9cb",
        "name": "Xã Hùng Việt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fdea6259ea",
        "name": "Xã Hương Cần",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67f4f52e55",
        "name": "Xã Hy Cương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad005a5e37",
        "name": "Xã Khả Cửu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2d3e77eea2",
        "name": "Xã Kim Bôi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-08d01d6932",
        "name": "Xã Lạc Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4a47d85616",
        "name": "Xã Lạc Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae54b97c8d",
        "name": "Xã Lạc Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3872dfb659",
        "name": "Xã Lai Đồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad58fc30bf",
        "name": "Xã Lâm Thao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6e794f7671",
        "name": "Xã Lập Thạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4683fd318f",
        "name": "Xã Liên Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c04825f509",
        "name": "Xã Liên Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00bd556e2e",
        "name": "Xã Liên Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-010bded48e",
        "name": "Xã Liên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ec405555de",
        "name": "Xã Long Cốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a3f75162a1",
        "name": "Xã Lương Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c0cdcbd057",
        "name": "Xã Mai Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d049210d73",
        "name": "Xã Mai Hạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-740f1de640",
        "name": "Xã Minh Đài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c5f81b2e3",
        "name": "Xã Minh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-13d8674de2",
        "name": "Xã Mường Bi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6a6943159",
        "name": "Xã Mường Động",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae52bdbed5",
        "name": "Xã Mường Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-82220cef3f",
        "name": "Xã Mường Thàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-911b30b377",
        "name": "Xã Mường Vang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28f9f5ff73",
        "name": "Xã Nật Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-247e272d31",
        "name": "Xã Ngọc Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00565551c3",
        "name": "Xã Nguyệt Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0891cdcbfc",
        "name": "Xã Nhân Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4fc32de8ac",
        "name": "Xã Pà Cò",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5e0ae82992",
        "name": "Xã Phú Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99e83427e2",
        "name": "Xã Phú Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c17a96b0f9",
        "name": "Xã Phù Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-961a1030d7",
        "name": "Xã Phùng Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2db4aab65",
        "name": "Xã Quảng Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84f9ad5548",
        "name": "Xã Quy Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ef4849833d",
        "name": "Xã Quyết Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0474481aa4",
        "name": "Xã Sông Lô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae067ac73d",
        "name": "Xã Sơn Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-715dbb31eb",
        "name": "Xã Sơn Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-21aa534227",
        "name": "Xã Tam Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0bb866ccdf",
        "name": "Xã Tam Dương Bắc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d10c6661d4",
        "name": "Xã Tam Đảo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-764290e8d1",
        "name": "Xã Tam Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a9bdfed637",
        "name": "Xã Tam Nông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8d3b381f02",
        "name": "Xã Tam Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c2ea9294d",
        "name": "Xã Tân Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a148a7965f",
        "name": "Xã Tân Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5642cb1460",
        "name": "Xã Tân Pheo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c853b39349",
        "name": "Xã Tân Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-05a8a7bc0c",
        "name": "Xã Tây Cốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b4d0414cf2",
        "name": "Xã Tề Lỗ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a60591d598",
        "name": "Xã Thái Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-68198f75bd",
        "name": "Xã Thanh Ba",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3a58b15167",
        "name": "Xã Thanh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a663d58ded",
        "name": "Xã Thanh Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ee0388387b",
        "name": "Xã Thịnh Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fddd945a46",
        "name": "Xã Thọ Văn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7275c5ba64",
        "name": "Xã Thổ Tang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc7d1c8303",
        "name": "Xã Thu Cúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-72324ed784",
        "name": "Xã Thung Nai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-58dc0be62a",
        "name": "Xã Thượng Cốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b7a724c4e2",
        "name": "Xã Thượng Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03175a8454",
        "name": "Xã Tiên Lữ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6aa38e0b51",
        "name": "Xã Tiên Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-898674f43a",
        "name": "Xã Tiền Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e81d4276c2",
        "name": "Xã Toàn Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ee3484b132",
        "name": "Xã Trạm Thản",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-287e72008e",
        "name": "Xã Trung Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a1f4b922c7",
        "name": "Xã Tu Vũ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-80b41aea1f",
        "name": "Xã Vạn Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cb2919ed47",
        "name": "Xã Văn Lang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8d47292244",
        "name": "Xã Văn Miếu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b18eb2d5a",
        "name": "Xã Vân Bán",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-817e5c054d",
        "name": "Xã Vân Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2482abdf2",
        "name": "Xã Vĩnh An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-41e8ea198b",
        "name": "Xã Vĩnh Chân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1ca647b4d8",
        "name": "Xã Vĩnh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-213b54a537",
        "name": "Xã Vĩnh Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7edbd7dcf7",
        "name": "Xã Vĩnh Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cdd9a282cf",
        "name": "Xã Vĩnh Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dcdad61f7a",
        "name": "Xã Võ Miếu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d8399a10ff",
        "name": "Xã Xuân Đài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8901e3cd16",
        "name": "Xã Xuân Lãng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c4285f4e4d",
        "name": "Xã Xuân Lũng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7cf0c7e5f3",
        "name": "Xã Xuân Viên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f03b4f3be7",
        "name": "Xã Yên Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c75eb3cf58",
        "name": "Xã Yên Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50cecb0297",
        "name": "Xã Yên Lãng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ae57f51dd",
        "name": "Xã Yên Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c17b00321",
        "name": "Xã Yên Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d8d109354",
        "name": "Xã Yên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8a67d8041d",
        "name": "Xã Yên Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bca641f8aa",
        "name": "Xã Yên Trị",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-4ae0c13cdc",
    "name": "Tỉnh Quảng Ngãi",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-ce995f380a",
        "name": "Đặc khu Lý Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20858a268b",
        "name": "Phường Cẩm Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4362dcc8ee",
        "name": "Phường Đăk Bla",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-216eec76ab",
        "name": "Phường Đăk Cấm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf58cd5b4b",
        "name": "Phường Đức Phổ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b09aca8053",
        "name": "Phường Kon Tum",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e2f1e4856",
        "name": "Phường Nghĩa Lộ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9484ac95b6",
        "name": "Phường Sa Huỳnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-68272fb94c",
        "name": "Phường Trà Câu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b11c200832",
        "name": "Phường Trương Quang Trọng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d70897dbca",
        "name": "Xã An Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-58877284ec",
        "name": "Xã Ba Dinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b7382ebbe6",
        "name": "Xã Ba Động",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4292f3d5d1",
        "name": "Xã Ba Gia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d762d7e05",
        "name": "Xã Ba Tô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9cc7a8d6d4",
        "name": "Xã Ba Tơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e1aa755cdf",
        "name": "Xã Ba Vì",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-75f178b7d2",
        "name": "Xã Ba Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-26c5b86d5d",
        "name": "Xã Ba Xa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c9d7064b8e",
        "name": "Xã Bình Chương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-df9f5776de",
        "name": "Xã Bình Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6f5b68946",
        "name": "Xã Bình Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b1beffbbff",
        "name": "Xã Bờ Y",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2dbd4d6873",
        "name": "Xã Cà Đam",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7b36b75d44",
        "name": "Xã Dục Nông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a5bed22664",
        "name": "Xã Đăk Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-82ff45e5af",
        "name": "Xã Đăk Kôi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-01e503833b",
        "name": "Xã Đăk Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-95dac66558",
        "name": "Xã Đăk Mar",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ce46ec5627",
        "name": "Xã Đăk Môn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e54b04850a",
        "name": "Xã Đăk Pék",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c31904ad1b",
        "name": "Xã Đăk Plô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a2e5b75cb7",
        "name": "Xã Đăk Pxi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7d9772f0c",
        "name": "Xã Đăk Rơ Wa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-30ab0f9635",
        "name": "Xã Đăk Rve",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d4468e3926",
        "name": "Xã Đăk Sao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7854a0c50c",
        "name": "Xã Đăk Tô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa750a9c10",
        "name": "Xã Đăk Tờ Kan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0093ab7a9b",
        "name": "Xã Đăk Ui",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50a7f8dfc6",
        "name": "Xã Đặng Thùy Trâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-565392957f",
        "name": "Xã Đình Cương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e6b8972ee0",
        "name": "Xã Đông Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-932ca7f209",
        "name": "Xã Đông Trà Bồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d721ce0d67",
        "name": "Xã Ia Chim",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e91a8120d",
        "name": "Xã Ia Đal",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1216074437",
        "name": "Xã Ia Tơi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb426a6721",
        "name": "Xã Khánh Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5cbfeeba9e",
        "name": "Xã Kon Braih",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-84957f66b8",
        "name": "Xã Kon Đào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-552544c894",
        "name": "Xã Kon Plông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b06978ec97",
        "name": "Xã Lân Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b53b42648c",
        "name": "Xã Long Phụng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a256b8c3de",
        "name": "Xã Măng Bút",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-65ea6473c7",
        "name": "Xã Măng Đen",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ff2a78b90",
        "name": "Xã Măng Ri",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-92f9a7344d",
        "name": "Xã Minh Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c5ead28157",
        "name": "Xã Mỏ Cày",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-22c0aa6c47",
        "name": "Xã Mộ Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-151490faf0",
        "name": "Xã Mô Rai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-37e7c11efa",
        "name": "Xã Nghĩa Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2075f2e819",
        "name": "Xã Nghĩa Hành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4c0b230826",
        "name": "Xã Ngọc Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b295f6642",
        "name": "Xã Ngọk Bay",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f159040d27",
        "name": "Xã Ngọk Réo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5b114b97eb",
        "name": "Xã Ngọk Tụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bfa4f212fd",
        "name": "Xã Nguyễn Nghiêm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-30871b1e37",
        "name": "Xã Phước Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-79119a3060",
        "name": "Xã Rờ Kơi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e56a879fc",
        "name": "Xã Sa Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0443c91495",
        "name": "Xã Sa Loong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6fbe31b14d",
        "name": "Xã Sa Thầy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bf7e7ffe87",
        "name": "Xã Sơn Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dfeb756932",
        "name": "Xã Sơn Hạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d9e58ae2c9",
        "name": "Xã Sơn Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff0ef8a3b8",
        "name": "Xã Sơn Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-95f5932c84",
        "name": "Xã Sơn Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a1344d3918",
        "name": "Xã Sơn Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e7806ffaa9",
        "name": "Xã Sơn Tây Hạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20c7b178e6",
        "name": "Xã Sơn Tây Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23c0edb396",
        "name": "Xã Sơn Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-217356093a",
        "name": "Xã Sơn Tịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be2e505afd",
        "name": "Xã Tây Trà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d305a29a3a",
        "name": "Xã Tây Trà Bồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae1524c349",
        "name": "Xã Thanh Bồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c4b9572285",
        "name": "Xã Thiện Tín",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-338583231c",
        "name": "Xã Thọ Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-265c884c83",
        "name": "Xã Tịnh Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d2eb0d0428",
        "name": "Xã Trà Bồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e0626d0def",
        "name": "Xã Trà Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c48fb247eb",
        "name": "Xã Trường Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-232dc40aa7",
        "name": "Xã Tu Mơ Rông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c75c68902e",
        "name": "Xã Tư Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-934c7a5e14",
        "name": "Xã Vạn Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d64ed4fad",
        "name": "Xã Vệ Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1df4038040",
        "name": "Xã Xốp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc28962c89",
        "name": "Xã Ya Ly",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-78f56c7736",
    "name": "Tỉnh Quảng Ninh",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-9ba9d9f98e",
        "name": "Đặc khu Cô Tô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9f84225d2",
        "name": "Đặc khu Vân Đồn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bc335c8aec",
        "name": "Phường An Sinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a9ea17e4f0",
        "name": "Phường Bãi Cháy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d9b50a4e60",
        "name": "Phường Bình Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c1828ae0f1",
        "name": "Phường Cao Xanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7559ab5173",
        "name": "Phường Cẩm Phả",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-95be46447d",
        "name": "Phường Cửa Ông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1435186a02",
        "name": "Phường Đông Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-077cb1cacc",
        "name": "Phường Đông Triều",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15432bad61",
        "name": "Phường Hà An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e474ea1e38",
        "name": "Phường Hà Lầm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6eee53255a",
        "name": "Phường Hạ Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7318f01d65",
        "name": "Phường Hà Tu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-70f2c59210",
        "name": "Phường Hiệp Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e2f32c9f84",
        "name": "Phường Hoàng Quế",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc8fd8fbe8",
        "name": "Phường Hoành Bồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-264bbd6794",
        "name": "Phường Hồng Gai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d9fb4892a",
        "name": "Phường Liên Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7da428f5c7",
        "name": "Phường Mạo Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e0abd1efda",
        "name": "Phường Móng Cái 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a45eee8f05",
        "name": "Phường Móng Cái 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4dbd8aa053",
        "name": "Phường Móng Cái 3",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-37c63aac3d",
        "name": "Phường Mông Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a7eaae1fc0",
        "name": "Phường Phong Cốc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fe646e61a8",
        "name": "Phường Quang Hanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50edb98d6c",
        "name": "Phường Quảng Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-317724d120",
        "name": "Phường Tuần Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-92867c93ef",
        "name": "Phường Uông Bí",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cdbbd5d97c",
        "name": "Phường Vàng Danh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ff1ab086e",
        "name": "Phường Việt Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1d27f8cfb5",
        "name": "Phường Yên Tử",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85061a938c",
        "name": "Xã Ba Chẽ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-28375a455b",
        "name": "Xã Bình Liêu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5dbb20b831",
        "name": "Xã Cái Chiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c72268b3d",
        "name": "Xã Đầm Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d0bf252142",
        "name": "Xã Điền Xá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7aed3cf8eb",
        "name": "Xã Đông Ngũ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c3688d0b0",
        "name": "Xã Đường Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c1cbc1ff6",
        "name": "Xã Hải Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-815224c1ab",
        "name": "Xã Hải Lạng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d1ec1ed369",
        "name": "Xã Hải Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eef6f3c508",
        "name": "Xã Hải Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca7beab45b",
        "name": "Xã Hoành Mô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00905b38e4",
        "name": "Xã Kỳ Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-31e7eaa809",
        "name": "Xã Lục Hồn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3859a031d2",
        "name": "Xã Lương Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6279e670a7",
        "name": "Xã Quảng Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3334eec3fd",
        "name": "Xã Quảng Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8d6db8f76d",
        "name": "Xã Quảng La",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-25a5dba59b",
        "name": "Xã Quảng Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83d7568910",
        "name": "Xã Thống Nhất",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8465c7fef5",
        "name": "Xã Tiên Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bbd7929183",
        "name": "Xã Vĩnh Thực",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-19a26e8aef",
    "name": "Tỉnh Quảng Trị",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-23914a766d",
        "name": "Đặc khu Cồn Cỏ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d372145c40",
        "name": "Phường Ba Đồn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85b09be73c",
        "name": "Phường Bắc Gianh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae80c290ad",
        "name": "Phường Đông Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5876a3c588",
        "name": "Phường Đồng Hới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a0ce368e99",
        "name": "Phường Đồng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-546b83b951",
        "name": "Phường Đồng Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-46b20f843d",
        "name": "Phường Nam Đông Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-21789dcedb",
        "name": "Phường Quảng Trị",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bf4ee11a15",
        "name": "Xã A Dơi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e9904244b6",
        "name": "Xã Ái Tử",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-af1b2819f8",
        "name": "Xã Ba Lòng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-54b48974fb",
        "name": "Xã Bắc Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-05bf9af1fa",
        "name": "Xã Bến Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c28de3100b",
        "name": "Xã Bến Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67e5b374f5",
        "name": "Xã Bố Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1d45a76a7a",
        "name": "Xã Cam Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac63677f01",
        "name": "Xã Cam Lộ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-40fb196e80",
        "name": "Xã Cồn Tiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1539da0d0b",
        "name": "Xã Cửa Tùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76a365508e",
        "name": "Xã Cửa Việt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-954799987e",
        "name": "Xã Dân Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-429b005080",
        "name": "Xã Diên Sanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-46be797f86",
        "name": "Xã Đakrông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dbfc095db7",
        "name": "Xã Đồng Lê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb2b8b5d30",
        "name": "Xã Đông Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7c94ed82fc",
        "name": "Xã Gio Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e5baaf9704",
        "name": "Xã Hải Lăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-02b7f5d9ec",
        "name": "Xã Hiếu Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e1a91daa0",
        "name": "Xã Hòa Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6285544dbb",
        "name": "Xã Hoàn Lão",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a16c5c7635",
        "name": "Xã Hướng Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a6ba463e7a",
        "name": "Xã Hướng Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1a26847afe",
        "name": "Xã Hướng Phùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1a3dbe8753",
        "name": "Xã Khe Sanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bffa0050cf",
        "name": "Xã Kim Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d2a74e1ce2",
        "name": "Xã Kim Ngân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-236ee295a4",
        "name": "Xã Kim Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d35af79e3",
        "name": "Xã La Lay",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b6b8a3759",
        "name": "Xã Lao Bảo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0bc4fc56dc",
        "name": "Xã Lệ Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eac3387c2f",
        "name": "Xã Lệ Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed8a61ec77",
        "name": "Xã Lìa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1021b70873",
        "name": "Xã Minh Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c9340f5a66",
        "name": "Xã Mỹ Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-522541da3c",
        "name": "Xã Nam Ba Đồn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c72a5cfa43",
        "name": "Xã Nam Cửa Việt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e80a8f50d4",
        "name": "Xã Nam Gianh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-adb93d5c0d",
        "name": "Xã Nam Hải Lăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-22a2350c4d",
        "name": "Xã Nam Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-af320ba4b9",
        "name": "Xã Ninh Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c28b9944d",
        "name": "Xã Phong Nha",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-34922fb2ee",
        "name": "Xã Phú Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-de8f11bba8",
        "name": "Xã Quảng Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-89f727aae5",
        "name": "Xã Quảng Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-520d64b14c",
        "name": "Xã Sen Ngư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c50c9fad2",
        "name": "Xã Tà Rụt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-698fd6056d",
        "name": "Xã Tân Gianh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d8b24eb32a",
        "name": "Xã Tân Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e02cb90da0",
        "name": "Xã Tân Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d14b91a246",
        "name": "Xã Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-362bbbe855",
        "name": "Xã Thượng Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a4a786569",
        "name": "Xã Triệu Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b7c7eb1d2",
        "name": "Xã Triệu Cơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d1bdabbfe",
        "name": "Xã Triệu Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cb01ea51c3",
        "name": "Xã Trung Thuần",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e8674672a2",
        "name": "Xã Trường Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f28d56ab24",
        "name": "Xã Trường Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-197feb4903",
        "name": "Xã Trường Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5efb6e1fe8",
        "name": "Xã Tuyên Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-251b00e57a",
        "name": "Xã Tuyên Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-98c05aa2b9",
        "name": "Xã Tuyên Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87a282473e",
        "name": "Xã Tuyên Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c00d6b248",
        "name": "Xã Tuyên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7af528488f",
        "name": "Xã Vĩnh Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dd0285b092",
        "name": "Xã Vĩnh Hoàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fd58992226",
        "name": "Xã Vĩnh Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d5bd73cabc",
        "name": "Xã Vĩnh Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-632595864a",
    "name": "Tỉnh Sơn La",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-23e87f27e2",
        "name": "Phường Chiềng An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5dc90e44e5",
        "name": "Phường Chiềng Cơi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c83c9aef2",
        "name": "Phường Chiềng Sinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-adf3392d87",
        "name": "Phường Mộc Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5a9a3a1979",
        "name": "Phường Mộc Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-92ec5c0e90",
        "name": "Phường Thảo Nguyên",
        "type": "",
        "deliveryAvailable": false,
        "pickupAvailable": false,
        "codAvailable": false,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5ab328bf52",
        "name": "Phường Tô Hiệu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-583862d328",
        "name": "Phường Vân Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c14c49832a",
        "name": "Xã Bắc Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1843b53828",
        "name": "Xã Bình Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd8251d170",
        "name": "Xã Bó Sinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6ae7d672ef",
        "name": "Xã Chiềng Hặc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-057a0938b2",
        "name": "Xã Chiềng Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f933b8fe30",
        "name": "Xã Chiềng Khoong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7cbec880d7",
        "name": "Xã Chiềng Khương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3a56644699",
        "name": "Xã Chiềng La",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-500acaaf1f",
        "name": "Xã Chiềng Lao",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-05c2e573b2",
        "name": "Xã Chiềng Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8e8d7b3290",
        "name": "Xã Chiềng Mung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-10c0aa3176",
        "name": "Xã Chiềng Sại",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab8871cfda",
        "name": "Xã Chiềng Sơ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f930eb762d",
        "name": "Xã Chiềng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7e3c68cf95",
        "name": "Xã Chiềng Sung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e5d2654526",
        "name": "Xã Co Mạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5048cd1435",
        "name": "Xã Đoàn Kết",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e3cc753342",
        "name": "Xã Gia Phù",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-235556b3d8",
        "name": "Xã Huổi Một",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c7e0e12797",
        "name": "Xã Kim Bon",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-070e5b6e07",
        "name": "Xã Long Hẹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-917e34c237",
        "name": "Xã Lóng Phiêng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab2ab57cae",
        "name": "Xã Lóng Sập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b6bdfb5c5",
        "name": "Xã Mai Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c93cb75ab5",
        "name": "Xã Muổi Nọi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-47542f44fa",
        "name": "Xã Mường Bám",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-453849b07e",
        "name": "Xã Mường Bang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d0cd1a84c7",
        "name": "Xã Mường Bú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a37dd176a",
        "name": "Xã Mường Chanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5bb1de427e",
        "name": "Xã Mường Chiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bac409f624",
        "name": "Xã Mường Cơi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6e14826a27",
        "name": "Xã Mường É",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-121609b618",
        "name": "Xã Mường Giôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d0259b29d",
        "name": "Xã Mường Hung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab22f5013b",
        "name": "Xã Mường Khiêng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c310936e6",
        "name": "Xã Mường La",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c71298f2cd",
        "name": "Xã Mường Lạn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aea3e9817e",
        "name": "Xã Mường Lầm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2f01c9a1a8",
        "name": "Xã Mường Lèo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c99bdcc49",
        "name": "Xã Mường Sại",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-860339c510",
        "name": "Xã Nậm Lầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b5e9fd749",
        "name": "Xã Nậm Ty",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-30b651b064",
        "name": "Xã Ngọc Chiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b0c458747",
        "name": "Xã Pắc Ngà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-620677e40c",
        "name": "Xã Phiêng Cằm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-917ada1f36",
        "name": "Xã Phiêng Khoài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d13ee6d87",
        "name": "Xã Phiêng Pằn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9124cc7ae1",
        "name": "Xã Phù Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b734e31f8",
        "name": "Xã Púng Bánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6857ee25a9",
        "name": "Xã Quỳnh Nhai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-819711f779",
        "name": "Xã Song Khủa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-41d818000c",
        "name": "Xã Sông Mã",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-62fe664a18",
        "name": "Xã Sốp Cộp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f4ba5fd290",
        "name": "Xã Suối Tọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f753c77d7f",
        "name": "Xã Tà Hộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-644a1e4710",
        "name": "Xã Tạ Khoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-04e9a2690e",
        "name": "Xã Tà Xùa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-479c0ada4a",
        "name": "Xã Tân Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-376c598260",
        "name": "Xã Tân Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dec32c7106",
        "name": "Xã Thuận Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2e92335aa",
        "name": "Xã Tô Múa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f9e0444c4c",
        "name": "Xã Tường Hạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-640ef265cb",
        "name": "Xã Vân Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1d1a8420ce",
        "name": "Xã Xím Vàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c883e3c880",
        "name": "Xã Xuân Nha",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e933fba7f8",
        "name": "Xã Yên Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d8cdd7432",
        "name": "Xã Yên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-a0c30346e7",
    "name": "Tỉnh Tây Ninh",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-0214966da6",
        "name": "Phường An Tịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1856a1dce0",
        "name": "Phường Bình Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1767825f73",
        "name": "Phường Gia Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bbf46be6e5",
        "name": "Phường Gò Dầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a277d27e4",
        "name": "Phường Hòa Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-734e5e2e4c",
        "name": "Phường Khánh Hậu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ce7029d7b",
        "name": "Phường Kiến Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64a70a0ed4",
        "name": "Phường Long An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-73b750dd97",
        "name": "Phường Long Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7302b1903f",
        "name": "Phường Ninh Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb0843ec2c",
        "name": "Phường Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6448b9677b",
        "name": "Phường Tân Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6e2d7e5eb",
        "name": "Phường Thanh Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e96981637",
        "name": "Phường Trảng Bàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4180a34488",
        "name": "Xã An Lục Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03d9134f8d",
        "name": "Xã An Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b30cb2d8d",
        "name": "Xã Bến Cầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2fa2d97291",
        "name": "Xã Bến Lức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a853bea0fe",
        "name": "Xã Bình Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bcf7e5c26f",
        "name": "Xã Bình Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-31b73fdfb2",
        "name": "Xã Bình Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-82409e4c1d",
        "name": "Xã Bình Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8416d0249b",
        "name": "Xã Cần Đước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc88dfe802",
        "name": "Xã Cần Giuộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d7994d763b",
        "name": "Xã Cầu Khởi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c0d43bdccd",
        "name": "Xã Châu Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e72854f8b5",
        "name": "Xã Dương Minh Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-19a19a83c3",
        "name": "Xã Đông Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f2db6be1c3",
        "name": "Xã Đức Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4f9c26a113",
        "name": "Xã Đức Huệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a71efc312",
        "name": "Xã Đức Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-42c8d7d58a",
        "name": "Xã Hảo Đước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-832e553db3",
        "name": "Xã Hậu Nghĩa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e648ee8a0",
        "name": "Xã Hậu Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ad7b19d808",
        "name": "Xã Hiệp Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6cf3bdd0e8",
        "name": "Xã Hòa Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-16ea820575",
        "name": "Xã Hòa Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-62e66e793a",
        "name": "Xã Hưng Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-90d43401cb",
        "name": "Xã Hưng Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db47578585",
        "name": "Xã Khánh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-22edcb87df",
        "name": "Xã Long Cang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4266077c7d",
        "name": "Xã Long Chữ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f818b774fb",
        "name": "Xã Long Hựu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ce31c07b8",
        "name": "Xã Long Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c8420d8704",
        "name": "Xã Lộc Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-74c484d367",
        "name": "Xã Lương Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4686bb4630",
        "name": "Xã Mộc Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d21bfb4f81",
        "name": "Xã Mỹ An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64049f0eeb",
        "name": "Xã Mỹ Hạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ffad8e1666",
        "name": "Xã Mỹ Lệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d90416bb6",
        "name": "Xã Mỹ Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dbc4c8fbfb",
        "name": "Xã Mỹ Quý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2cb343b9ce",
        "name": "Xã Mỹ Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5d731931a5",
        "name": "Xã Mỹ Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0138a06e46",
        "name": "Xã Nhơn Hòa Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f1121ec751",
        "name": "Xã Nhơn Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca1a8d7666",
        "name": "Xã Nhựt Tảo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5935cede8d",
        "name": "Xã Ninh Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e3e76864a6",
        "name": "Xã Phước Chỉ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-08bb4be8de",
        "name": "Xã Phước Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-074d63be37",
        "name": "Xã Phước Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e1fc912132",
        "name": "Xã Phước Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-68e4ff8654",
        "name": "Xã Phước Vĩnh Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2cd2ceb9fb",
        "name": "Xã Rạch Kiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c3a1c27640",
        "name": "Xã Tầm Vu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f058e5b1ce",
        "name": "Xã Tân Biên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab0f38ce93",
        "name": "Xã Tân Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2eddfef3e6",
        "name": "Xã Tân Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ffe185f957",
        "name": "Xã Tân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5323d51a5e",
        "name": "Xã Tân Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cbf6206384",
        "name": "Xã Tân Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85a557e8e7",
        "name": "Xã Tân Lân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-34ba54b9c0",
        "name": "Xã Tân Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23c83e4a30",
        "name": "Xã Tân Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f3a4cbfdf0",
        "name": "Xã Tân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b5ca41e539",
        "name": "Xã Tân Tập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-61c8b00f34",
        "name": "Xã Tân Tây",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b6807c060c",
        "name": "Xã Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7392d0190b",
        "name": "Xã Tân Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b3c032fc9",
        "name": "Xã Tân Trụ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e8537ff1b",
        "name": "Xã Thạnh Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4924347c3e",
        "name": "Xã Thạnh Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-04effe8a60",
        "name": "Xã Thạnh Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db1ee92689",
        "name": "Xã Thạnh Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-26cf7cd0e8",
        "name": "Xã Thạnh Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dfb1deefba",
        "name": "Xã Thủ Thừa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ffaeeafcf",
        "name": "Xã Thuận Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f6671d3235",
        "name": "Xã Trà Vong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-046badc80e",
        "name": "Xã Truông Mít",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-77d8796ef9",
        "name": "Xã Tuyên Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1409ccafc8",
        "name": "Xã Tuyên Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6fd81d2c5b",
        "name": "Xã Vàm Cỏ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f9f20c9cc0",
        "name": "Xã Vĩnh Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e08411407f",
        "name": "Xã Vĩnh Công",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-054aa197f7",
        "name": "Xã Vĩnh Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fc83708d9c",
        "name": "Xã Vĩnh Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-7a8e6264ed",
    "name": "Tỉnh Thái Nguyên",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-5b57295f5e",
        "name": "Phường Bá Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8bb78fd3c3",
        "name": "Phường Bách Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-da76264833",
        "name": "Phường Bắc Kạn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ec6863da6",
        "name": "Phường Đức Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-347998beb0",
        "name": "Phường Gia Sàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac2a86f0bf",
        "name": "Phường Linh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f43a9ce11e",
        "name": "Phường Phan Đình Phùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc5337b1e2",
        "name": "Phường Phổ Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7c9c6995d8",
        "name": "Phường Phúc Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-00651a908a",
        "name": "Phường Quan Triều",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e35ff1622",
        "name": "Phường Quyết Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f47735c388",
        "name": "Phường Sông Công",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9dd50717e6",
        "name": "Phường Tích Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-432b7a885b",
        "name": "Phường Trung Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c540a10c58",
        "name": "Phường Vạn Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6eab083701",
        "name": "Xã An Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-90b9aa6df9",
        "name": "Xã Ba Bể",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b64706c663",
        "name": "Xã Bạch Thông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-587f49d671",
        "name": "Xã Bằng Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7bbc082537",
        "name": "Xã Bằng Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e1b59bc126",
        "name": "Xã Bình Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fce54d703d",
        "name": "Xã Bình Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-49a33d5f45",
        "name": "Xã Cao Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-532f7828ce",
        "name": "Xã Cẩm Giàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2aa31a6876",
        "name": "Xã Chợ Đồn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-44db5a5223",
        "name": "Xã Chợ Mới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b32f4fa460",
        "name": "Xã Chợ Rã",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d153ff54a",
        "name": "Xã Côn Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8730142b36",
        "name": "Xã Cường Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-439b7f52b8",
        "name": "Xã Dân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-211d380230",
        "name": "Xã Đại Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e238575016",
        "name": "Xã Đại Từ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0f5841d5da",
        "name": "Xã Điềm Thụy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4fb689f9bb",
        "name": "Xã Định Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b33fdc5963",
        "name": "Xã Đồng Hỷ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e830f07c71",
        "name": "Xã Đồng Phúc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-972e302cd5",
        "name": "Xã Đức Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7262843477",
        "name": "Xã Hiệp Lực",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8d561a2a5e",
        "name": "Xã Hợp Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1cf1005d74",
        "name": "Xã Kha Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-42dacf49d5",
        "name": "Xã Kim Phượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-24041c6980",
        "name": "Xã La Bằng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-92d7ac2752",
        "name": "Xã La Hiên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2afd48bcc6",
        "name": "Xã Lam Vỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-46e78a7a0f",
        "name": "Xã Nà Phặc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-01d5e7e91a",
        "name": "Xã Na Rì",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6d7b10cb11",
        "name": "Xã Nam Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-04e43cae94",
        "name": "Xã Nam Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-417bff2090",
        "name": "Xã Ngân Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-874a1c7db9",
        "name": "Xã Nghĩa Tá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-381e9fe4fb",
        "name": "Xã Nghiên Loan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-43736c47b0",
        "name": "Xã Nghinh Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f4ab5b24e8",
        "name": "Xã Phong Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-654c394e02",
        "name": "Xã Phú Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-797d1a87e1",
        "name": "Xã Phú Đình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64d9cabfc2",
        "name": "Xã Phú Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d79e8e950a",
        "name": "Xã Phú Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0bcf2cff44",
        "name": "Xã Phú Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c5b7d83b77",
        "name": "Xã Phủ Thông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8ed2662fa2",
        "name": "Xã Phú Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ec9ba5644",
        "name": "Xã Phúc Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f5b98e7246",
        "name": "Xã Phượng Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0e1cb6ab93",
        "name": "Xã Quảng Bạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-20745a2db7",
        "name": "Xã Quang Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d0e98a235f",
        "name": "Xã Quân Chu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1983e6046e",
        "name": "Xã Sảng Mộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-24347f4076",
        "name": "Xã Tân Cương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0e2609b1cb",
        "name": "Xã Tân Khánh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-85c540b580",
        "name": "Xã Tân Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-04f964c17c",
        "name": "Xã Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7db4ad11ba",
        "name": "Xã Thành Công",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bd54c071cd",
        "name": "Xã Thanh Mai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d661a8c107",
        "name": "Xã Thanh Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d6e920504f",
        "name": "Xã Thần Sa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b3cda4ed12",
        "name": "Xã Thượng Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9a5683793e",
        "name": "Xã Thượng Quan",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-23a7dfda58",
        "name": "Xã Trại Cau",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-df930acb2b",
        "name": "Xã Tràng Xá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-01afccaf6a",
        "name": "Xã Trần Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-427fb49df6",
        "name": "Xã Trung Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-356df2621a",
        "name": "Xã Vạn Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d22b0437da",
        "name": "Xã Văn Hán",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc373db50c",
        "name": "Xã Văn Lang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c037da775a",
        "name": "Xã Văn Lăng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8a9dd0f52e",
        "name": "Xã Vĩnh Thông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-140954d661",
        "name": "Xã Võ Nhai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a2422cbbf1",
        "name": "Xã Vô Tranh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b7816399e2",
        "name": "Xã Xuân Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8c8f004762",
        "name": "Xã Yên Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e8c0d19905",
        "name": "Xã Yên Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a493af515a",
        "name": "Xã Yên Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a9515c8aaf",
        "name": "Xã Yên Trạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-505bf88a29",
    "name": "Tỉnh Thanh Hóa",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-8149fbfa5b",
        "name": "Phường Bỉm Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-37884a31a1",
        "name": "Phường Đào Duy Từ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d27376337",
        "name": "Phường Đông Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-17a7480a6c",
        "name": "Phường Đông Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae9750dec5",
        "name": "Phường Đông Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3aae612f8d",
        "name": "Phường Hạc Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ba192784c",
        "name": "Phường Hải Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-98035a3d4f",
        "name": "Phường Hải Lĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-434769fba6",
        "name": "Phường Hàm Rồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-047b79f90b",
        "name": "Phường Nam Sầm Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bb86b446a0",
        "name": "Phường Nghi Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-340a052a78",
        "name": "Phường Ngọc Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-86fec16d37",
        "name": "Phường Nguyệt Viên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc40e737bf",
        "name": "Phường Quảng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d19aac80e6",
        "name": "Phường Quang Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-61e441fbee",
        "name": "Phường Sầm Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0ddaf3489e",
        "name": "Phường Tân Dân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-56c81ad820",
        "name": "Phường Tĩnh Gia",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6103cded88",
        "name": "Phường Trúc Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab6080db04",
        "name": "Xã An Nông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c129cb9a1d",
        "name": "Xã Ba Đình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f8203ec16",
        "name": "Xã Bá Thước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8cf014b485",
        "name": "Xã Bát Mọt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ba7e3f305f",
        "name": "Xã Biện Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b5f44e002f",
        "name": "Xã Các Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c3ee81b852",
        "name": "Xã Cẩm Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6a678d8390",
        "name": "Xã Cẩm Thạch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-54b03335b3",
        "name": "Xã Cẩm Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b02271aeb3",
        "name": "Xã Cẩm Tú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8eafa5b080",
        "name": "Xã Cẩm Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ebcc6ea994",
        "name": "Xã Cổ Lũng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e66580d9c8",
        "name": "Xã Công Chính",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5c218d1b57",
        "name": "Xã Điền Lư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-90855e34eb",
        "name": "Xã Điền Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b9ccc901a",
        "name": "Xã Định Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03e5675b41",
        "name": "Xã Định Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3f9e1e0d4b",
        "name": "Xã Đồng Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3efe214439",
        "name": "Xã Đông Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-672d040131",
        "name": "Xã Đồng Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-63c3a893d8",
        "name": "Xã Giao An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c425395d27",
        "name": "Xã Hà Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c31856608",
        "name": "Xã Hà Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eb9c41e9d0",
        "name": "Xã Hậu Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4a75875ac6",
        "name": "Xã Hiền Kiệt",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50a104f3c6",
        "name": "Xã Hoa Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c5814425ac",
        "name": "Xã Hóa Quỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-12a51267c7",
        "name": "Xã Hoạt Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5474f198cb",
        "name": "Xã Hoằng Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2060c1ce29",
        "name": "Xã Hoằng Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e3b1fb3c2b",
        "name": "Xã Hoằng Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4d1cd84996",
        "name": "Xã Hoằng Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b047d03ab",
        "name": "Xã Hoằng Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d1589f5e08",
        "name": "Xã Hoằng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0f889d861e",
        "name": "Xã Hoằng Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e055a0605a",
        "name": "Xã Hoằng Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f05824996f",
        "name": "Xã Hồ Vương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2dc2974202",
        "name": "Xã Hồi Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-36093827bd",
        "name": "Xã Hợp Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2d6fa800c4",
        "name": "Xã Kiên Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99a1261a0b",
        "name": "Xã Kim Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-650c8e372b",
        "name": "Xã Lam Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fa67b5458f",
        "name": "Xã Linh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ee15a3cd1",
        "name": "Xã Lĩnh Toại",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b6c6fa31f5",
        "name": "Xã Luận Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5cc705e17b",
        "name": "Xã Lương Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a3b9b57f2",
        "name": "Xã Lưu Vệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-36be5c4a51",
        "name": "Xã Mậu Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-65eddbbda2",
        "name": "Xã Minh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d87784c329",
        "name": "Xã Mường Chanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ce024715d6",
        "name": "Xã Mường Lát",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d5d537a26",
        "name": "Xã Mường Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-73252d4de2",
        "name": "Xã Mường Mìn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-90eb06d2b2",
        "name": "Xã Na Mèo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-06d7870a34",
        "name": "Xã Nam Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1296f43c65",
        "name": "Xã Nga An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6fcfc93ba7",
        "name": "Xã Nga Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eaadef50e5",
        "name": "Xã Nga Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c7c8fafe52",
        "name": "Xã Ngọc Lặc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c832e8d6c",
        "name": "Xã Ngọc Liên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1f99d155e0",
        "name": "Xã Ngọc Trạo",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-63b76d3aea",
        "name": "Xã Nguyệt Ấn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-62fc598dee",
        "name": "Xã Nhi Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e9607faa8",
        "name": "Xã Như Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-721523cb4f",
        "name": "Xã Như Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-707a8a0065",
        "name": "Xã Nông Cống",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e7f2f5fca9",
        "name": "Xã Phú Lệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1baeef98f6",
        "name": "Xã Phú Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-34bfae4058",
        "name": "Xã Pù Luông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-db84d14ce4",
        "name": "Xã Pù Nhi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b67126e55a",
        "name": "Xã Quan Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-48f2c0b0bc",
        "name": "Xã Quảng Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-881e54dce8",
        "name": "Xã Quang Chiểu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ec24d03266",
        "name": "Xã Quảng Chính",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc0ed62193",
        "name": "Xã Quảng Ngọc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b71c4faeb9",
        "name": "Xã Quảng Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c6b1c078a",
        "name": "Xã Quảng Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32cd925f8f",
        "name": "Xã Quý Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0485314386",
        "name": "Xã Quý Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c111522c94",
        "name": "Xã Sao Vàng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87746f9d71",
        "name": "Xã Sơn Điện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff0c18bbf6",
        "name": "Xã Sơn Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-717b8bd912",
        "name": "Xã Tam Chung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-43c5e39bd1",
        "name": "Xã Tam Lư",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e73912555d",
        "name": "Xã Tam Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-969718559c",
        "name": "Xã Tân Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-68d93afdaf",
        "name": "Xã Tân Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f996c29ae5",
        "name": "Xã Tân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-544322e23b",
        "name": "Xã Tây Đô",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1827f3b325",
        "name": "Xã Thạch Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc40492735",
        "name": "Xã Thạch Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b3cb8840e4",
        "name": "Xã Thạch Quảng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d9dffe5058",
        "name": "Xã Thanh Kỳ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32a06492f7",
        "name": "Xã Thanh Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-affd79a768",
        "name": "Xã Thanh Quân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ddf176b669",
        "name": "Xã Thành Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e2a824edd5",
        "name": "Xã Thăng Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b18f3c06f",
        "name": "Xã Thắng Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f0c50b5895",
        "name": "Xã Thắng Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c712391f7",
        "name": "Xã Thiên Phủ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cf139550d5",
        "name": "Xã Thiết Ống",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15278a2ee1",
        "name": "Xã Thiệu Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e91ed920ac",
        "name": "Xã Thiệu Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2c243acf03",
        "name": "Xã Thiệu Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9bfcd9dee0",
        "name": "Xã Thiệu Toán",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7ca04a5cfd",
        "name": "Xã Thiệu Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2a46876238",
        "name": "Xã Thọ Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ed8b4a8f5b",
        "name": "Xã Thọ Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f35cd014d4",
        "name": "Xã Thọ Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50bde69b4e",
        "name": "Xã Thọ Ngọc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2f70d1d53b",
        "name": "Xã Thọ Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3723d75485",
        "name": "Xã Thọ Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5bfa0ecaad",
        "name": "Xã Thượng Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-51cb8d8483",
        "name": "Xã Thường Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a86992284",
        "name": "Xã Tiên Trang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fe8d3ccb64",
        "name": "Xã Tống Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab1f512d4d",
        "name": "Xã Triệu Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1b1579ca71",
        "name": "Xã Triệu Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ea0b9af2fa",
        "name": "Xã Trung Chính",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2f8eca9284",
        "name": "Xã Trung Hạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bd9957f1bd",
        "name": "Xã Trung Lý",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-da08177dd2",
        "name": "Xã Trung Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e00b1c754d",
        "name": "Xã Trung Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-54ef2d1c83",
        "name": "Xã Trường Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-063764023a",
        "name": "Xã Trường Văn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96fa58f24e",
        "name": "Xã Tượng Lĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-58ffc3dae5",
        "name": "Xã Vạn Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5933cd358c",
        "name": "Xã Vạn Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-45e75bee98",
        "name": "Xã Văn Nho",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2783b92877",
        "name": "Xã Văn Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-15ffb1da5a",
        "name": "Xã Vân Du",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7f4a43d668",
        "name": "Xã Vĩnh Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dbeca62734",
        "name": "Xã Xuân Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4245787743",
        "name": "Xã Xuân Chinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-10a537782d",
        "name": "Xã Xuân Du",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3ab1e17d13",
        "name": "Xã Xuân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-97ad8c4e04",
        "name": "Xã Xuân Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a062d8085",
        "name": "Xã Xuân Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-33de0c4c55",
        "name": "Xã Xuân Tín",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-98ef41e7a5",
        "name": "Xã Yên Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-46c0e0c669",
        "name": "Xã Yên Khương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cc68879f28",
        "name": "Xã Yên Nhân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3cb7e4fffd",
        "name": "Xã Yên Ninh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5f588ae30c",
        "name": "Xã Yên Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5dfcae392c",
        "name": "Xã Yên Thắng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8f0fdf1628",
        "name": "Xã Yên Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d81d03f40f",
        "name": "Xã Yên Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-6e1eec6e3f",
    "name": "Tỉnh Tuyên Quang",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-78be0663d1",
        "name": "Phường An Tường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fea271400c",
        "name": "Phường Bình Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c04446d02b",
        "name": "Phường Hà Giang 1",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cec8af4ff3",
        "name": "Phường Hà Giang 2",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-75ec440680",
        "name": "Phường Minh Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae887fa4c5",
        "name": "Phường Mỹ Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be4b3a8edd",
        "name": "Phường Nông Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7378b853bb",
        "name": "Xã Bạch Đích",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2a1d776fa",
        "name": "Xã Bạch Ngọc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cd80a46fef",
        "name": "Xã Bạch Xa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-faf8b2d5cd",
        "name": "Xã Bản Máy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c6680d2d0c",
        "name": "Xã Bắc Mê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a00df9f897",
        "name": "Xã Bắc Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-106dcd8905",
        "name": "Xã Bằng Hành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c721d83158",
        "name": "Xã Bằng Lang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-79b176ba03",
        "name": "Xã Bình An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-19525192b8",
        "name": "Xã Bình Ca",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-466ebef449",
        "name": "Xã Bình Xa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a446d4190",
        "name": "Xã Cán Tỷ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-629d57c612",
        "name": "Xã Cao Bồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e5810dd0b6",
        "name": "Xã Chiêm Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-030876d97e",
        "name": "Xã Côn Lôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a935546f6",
        "name": "Xã Du Già",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64152596ba",
        "name": "Xã Đồng Tâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-308b8b8afb",
        "name": "Xã Đông Thọ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c2fd2c6274",
        "name": "Xã Đồng Văn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1e6bf418a0",
        "name": "Xã Đồng Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-230079d9aa",
        "name": "Xã Đường Hồng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d708bf3695",
        "name": "Xã Đường Thượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1a7e1b137e",
        "name": "Xã Giáp Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c16b63f1b",
        "name": "Xã Hàm Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b12702632",
        "name": "Xã Hòa An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2bdffd4d20",
        "name": "Xã Hoàng Su Phì",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1a6052a170",
        "name": "Xã Hồ Thầu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-34a44a8054",
        "name": "Xã Hồng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1b45cfd27f",
        "name": "Xã Hồng Thái",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a0f698a80",
        "name": "Xã Hùng An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7783186fd9",
        "name": "Xã Hùng Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-27162ec7e3",
        "name": "Xã Hùng Lợi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-018da167d3",
        "name": "Xã Khâu Vai",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87a31d618b",
        "name": "Xã Khuôn Lùng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3b70dc7c22",
        "name": "Xã Kiên Đài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff9c78651a",
        "name": "Xã Kiến Thiết",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f1a1348832",
        "name": "Xã Kim Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fcd1c14a07",
        "name": "Xã Lao Chải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e12a069a53",
        "name": "Xã Lâm Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2edbc2d264",
        "name": "Xã Liên Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-45fb8834df",
        "name": "Xã Linh Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ef982b7dc",
        "name": "Xã Lũng Cú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1d14f099bf",
        "name": "Xã Lũng Phìn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-56b6d8951d",
        "name": "Xã Lùng Tám",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b8380fa33",
        "name": "Xã Lực Hành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0470c2507c",
        "name": "Xã Mậu Duệ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d1fbd35eb7",
        "name": "Xã Mèo Vạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6263466d8b",
        "name": "Xã Minh Ngọc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8c824c274c",
        "name": "Xã Minh Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-50e19798fa",
        "name": "Xã Minh Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eb7f887488",
        "name": "Xã Minh Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b164f43aee",
        "name": "Xã Minh Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ea7b25ee21",
        "name": "Xã Nà Hang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9d16ad1ba2",
        "name": "Xã Nấm Dẩn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac4990f427",
        "name": "Xã Nậm Dịch",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5bf9fb2e1c",
        "name": "Xã Nghĩa Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-76f2b8ed4e",
        "name": "Xã Ngọc Đường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87a38ca23d",
        "name": "Xã Ngọc Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d8535a388b",
        "name": "Xã Nhữ Khê",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-af341c05b9",
        "name": "Xã Niêm Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e36d873cfa",
        "name": "Xã Pà Vầy Sủ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e58f63e09d",
        "name": "Xã Phố Bảng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b3b6def82a",
        "name": "Xã Phú Linh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8b7ca258d8",
        "name": "Xã Phú Lương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bddbee41b5",
        "name": "Xã Phù Lưu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e1be60686",
        "name": "Xã Pờ Ly Ngài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-da8c800a33",
        "name": "Xã Quản Bạ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eba3fe5402",
        "name": "Xã Quang Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aa6f3b5c45",
        "name": "Xã Quảng Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b9557fe634",
        "name": "Xã Sà Phìn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-80def1a9e0",
        "name": "Xã Sơn Dương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-257bc8c697",
        "name": "Xã Sơn Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f7e69618a0",
        "name": "Xã Sơn Vĩ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-47fdd13841",
        "name": "Xã Sủng Máng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dde126306c",
        "name": "Xã Tát Ngà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-55f544f539",
        "name": "Xã Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0f505ae763",
        "name": "Xã Tân Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2383119347",
        "name": "Xã Tân Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-183b9cb6b8",
        "name": "Xã Tân Quang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b89312541",
        "name": "Xã Tân Thanh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c06d32fddf",
        "name": "Xã Tân Tiến",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3c5a04835b",
        "name": "Xã Tân Trào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-25d0e3f725",
        "name": "Xã Tân Trịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fbdd8244ca",
        "name": "Xã Thái Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-99dbd528e4",
        "name": "Xã Thái Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f4c1ab096e",
        "name": "Xã Thái Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83eff0d848",
        "name": "Xã Thàng Tín",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f5168229c3",
        "name": "Xã Thanh Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4b92ec27fb",
        "name": "Xã Thắng Mố",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ccfd59194e",
        "name": "Xã Thông Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a455010d73",
        "name": "Xã Thuận Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8f9fb5739e",
        "name": "Xã Thượng Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8a273b4b4b",
        "name": "Xã Thượng Nông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f70f88d24",
        "name": "Xã Thượng Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1281f9a29a",
        "name": "Xã Tiên Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-590da92b35",
        "name": "Xã Tiên Yên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dba1506729",
        "name": "Xã Tri Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9ab79d9213",
        "name": "Xã Trung Hà",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4941d4143f",
        "name": "Xã Trung Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-fbad7706e5",
        "name": "Xã Trung Thịnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0d5a7d1a59",
        "name": "Xã Trường Sinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2ab10eef1d",
        "name": "Xã Tùng Bá",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c87b709424",
        "name": "Xã Tùng Vài",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9f013feb75",
        "name": "Xã Vị Xuyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c336f4cca",
        "name": "Xã Việt Lâm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1248447bf6",
        "name": "Xã Vĩnh Tuy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b7052ff4df",
        "name": "Xã Xín Mần",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff4e25eb00",
        "name": "Xã Xuân Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b80e9b00fa",
        "name": "Xã Xuân Vân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-81394f278e",
        "name": "Xã Yên Cường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9c68eda225",
        "name": "Xã Yên Hoa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-319f392f71",
        "name": "Xã Yên Lập",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aed02baf2a",
        "name": "Xã Yên Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ae2b230b3e",
        "name": "Xã Yên Nguyên",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9461123f9a",
        "name": "Xã Yên Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b14e40c3a",
        "name": "Xã Yên Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4cee460d3f",
        "name": "Xã Yên Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": false,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  },
  {
    "level1_id": "spx-p-e2219457de",
    "name": "Tỉnh Vĩnh Long",
    "type": "",
    "level2s": [
      {
        "level2_id": "spx-w-445da7c6f2",
        "name": "Phường An Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4cf8163ed9",
        "name": "Phường Bến Tre",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-de680460e4",
        "name": "Phường Bình Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3a80cb13f3",
        "name": "Phường Cái Vồn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-be1e027ae9",
        "name": "Phường Duyên Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d9431e7f1a",
        "name": "Phường Đông Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2f60472bec",
        "name": "Phường Hòa Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-bf1a9e5af6",
        "name": "Phường Long Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab3b73d6da",
        "name": "Phường Long Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d4d49cde74",
        "name": "Phường Nguyệt Hóa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-269fa469f6",
        "name": "Phường Phú Khương",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c74e39f0ba",
        "name": "Phường Phú Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ca50493feb",
        "name": "Phường Phước Hậu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7bbda6e757",
        "name": "Phường Sơn Đông",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eb669480ca",
        "name": "Phường Tân Hạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b4164ee621",
        "name": "Phường Tân Ngãi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ab02c2061a",
        "name": "Phường Thanh Đức",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e94508bcde",
        "name": "Phường Trà Vinh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a9b2ddf3e2",
        "name": "Phường Trường Long Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7cd3d9a890",
        "name": "Xã An Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3825d63a71",
        "name": "Xã An Định",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-98972bcf54",
        "name": "Xã An Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d3a1b94097",
        "name": "Xã An Ngãi Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-65442eb852",
        "name": "Xã An Phú Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-18c629e8f2",
        "name": "Xã An Qui",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-90e25f5e2e",
        "name": "Xã An Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e5079215ab",
        "name": "Xã Ba Tri",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f88eb35384",
        "name": "Xã Bảo Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7810fdaa0f",
        "name": "Xã Bình Đại",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ea7eef4511",
        "name": "Xã Bình Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e907fe63c1",
        "name": "Xã Bình Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-411f647377",
        "name": "Xã Cái Ngang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2b73574240",
        "name": "Xã Cái Nhum",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-080e61fdaa",
        "name": "Xã Càng Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9589ff8185",
        "name": "Xã Cầu Kè",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-88458eedd6",
        "name": "Xã Cầu Ngang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4ef9393e75",
        "name": "Xã Châu Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a80856e115",
        "name": "Xã Châu Hưng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b507b4531b",
        "name": "Xã Châu Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d4fdaee370",
        "name": "Xã Chợ Lách",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d671bc1f4",
        "name": "Xã Đại An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3d99d5cb4c",
        "name": "Xã Đại Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6c2e4e923f",
        "name": "Xã Đôn Châu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ac9ba44aa6",
        "name": "Xã Đông Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f65e35f6b9",
        "name": "Xã Đồng Khởi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f4e3c86060",
        "name": "Xã Giao Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6fc2226d41",
        "name": "Xã Giồng Trôm",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f679dca9ab",
        "name": "Xã Hàm Giang",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-39c6869237",
        "name": "Xã Hiệp Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d046347a99",
        "name": "Xã Hiếu Phụng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-722ee26a75",
        "name": "Xã Hiếu Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dfe8b4f219",
        "name": "Xã Hòa Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-eb53919c62",
        "name": "Xã Hòa Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5ce0f29905",
        "name": "Xã Hòa Minh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e67dc7de1a",
        "name": "Xã Hùng Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-601f234788",
        "name": "Xã Hưng Khánh Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-17947142bf",
        "name": "Xã Hưng Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-83b8081c03",
        "name": "Xã Hưng Nhượng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-14278edc18",
        "name": "Xã Hương Mỹ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f68be74b57",
        "name": "Xã Long Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e658f10fcf",
        "name": "Xã Long Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-263af561d8",
        "name": "Xã Long Hồ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5d835145eb",
        "name": "Xã Long Hữu",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aeb78cdf3e",
        "name": "Xã Long Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9645333438",
        "name": "Xã Long Vĩnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9cd9425996",
        "name": "Xã Lộc Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-cfe66baea0",
        "name": "Xã Lục Sĩ Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-56f8af1e38",
        "name": "Xã Lương Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-efb031c30b",
        "name": "Xã Lương Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-8defc56bde",
        "name": "Xã Lưu Nghiệp Anh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7a7c963878",
        "name": "Xã Mỏ Cày",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-57779b8e1a",
        "name": "Xã Mỹ Chánh Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0754cc607f",
        "name": "Xã Mỹ Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6b3cd1514e",
        "name": "Xã Mỹ Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-03b666a063",
        "name": "Xã Ngãi Tứ",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7d5f2a1ba8",
        "name": "Xã Ngũ Lạc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-71c6d87794",
        "name": "Xã Nhị Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f1c306ed7d",
        "name": "Xã Nhị Trường",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c369149b33",
        "name": "Xã Nhơn Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-32faf01df8",
        "name": "Xã Nhuận Phú Tân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2e15aeab83",
        "name": "Xã Phong Thạnh",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ef060f239b",
        "name": "Xã Phú Phụng",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0b8c35fb89",
        "name": "Xã Phú Quới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-004a8ea531",
        "name": "Xã Phú Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6039d056b9",
        "name": "Xã Phú Túc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67ba20a231",
        "name": "Xã Phước Long",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6709e7d744",
        "name": "Xã Phước Mỹ Trung",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-1577d77ec9",
        "name": "Xã Quới An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-2725c34310",
        "name": "Xã Quới Điền",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4139501ea6",
        "name": "Xã Quới Thiện",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5770aac3cf",
        "name": "Xã Song Lộc",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-35b9703d76",
        "name": "Xã Song Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-10422bce8a",
        "name": "Xã Tam Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-64961f9a72",
        "name": "Xã Tam Ngãi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-7dda65a029",
        "name": "Xã Tân An",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-f07694e8cc",
        "name": "Xã Tân Hào",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0a80fe2a92",
        "name": "Xã Tân Hòa",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-432f23c857",
        "name": "Xã Tân Long Hội",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-6282b973b2",
        "name": "Xã Tân Lược",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-a3fb8df754",
        "name": "Xã Tân Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e0b3152229",
        "name": "Xã Tân Quới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-3e4ebe3759",
        "name": "Xã Tân Thành Bình",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-406639a797",
        "name": "Xã Tân Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-67e23d3897",
        "name": "Xã Tân Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-b0bae0daaa",
        "name": "Xã Tập Ngãi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-5648509d7b",
        "name": "Xã Tập Sơn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c67ff43728",
        "name": "Xã Thạnh Hải",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-aeb654e67e",
        "name": "Xã Thạnh Phong",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-9efe1067e4",
        "name": "Xã Thạnh Phú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-56c5a9def0",
        "name": "Xã Thạnh Phước",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-95cb787570",
        "name": "Xã Thành Thới",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4477f40639",
        "name": "Xã Thạnh Trị",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-0c33af3857",
        "name": "Xã Thới Thuận",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-c4e3a98632",
        "name": "Xã Tiên Thủy",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-96b4c68b4a",
        "name": "Xã Tiểu Cần",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4fbc72eab2",
        "name": "Xã Trà Côn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-060270b0cc",
        "name": "Xã Trà Cú",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-ff625ded19",
        "name": "Xã Trà Ôn",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-87eee48ab2",
        "name": "Xã Trung Hiệp",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-69bffa5b83",
        "name": "Xã Trung Ngãi",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-dc0df8da9e",
        "name": "Xã Trung Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-4e8cb9ed9b",
        "name": "Xã Vinh Kim",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-d9025e6ae5",
        "name": "Xã Vĩnh Thành",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      },
      {
        "level2_id": "spx-w-e1202876bb",
        "name": "Xã Vĩnh Xuân",
        "type": "",
        "deliveryAvailable": true,
        "pickupAvailable": true,
        "codAvailable": true,
        "status": "Available"
      }
    ]
  }
];
