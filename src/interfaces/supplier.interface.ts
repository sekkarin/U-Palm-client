interface ContactPerson {
    con_person: string;
    email: string;
    telephone: string;
    address: string;
    con_remark: string;
  }
  
export  interface ISupplier {
    name: string;
    email: string;
    country: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    profileImage: string;
    contacts_person_1: ContactPerson;
    contacts_person_2?: ContactPerson;
    createdAt: string;
    supplier_id: string;
  }
  