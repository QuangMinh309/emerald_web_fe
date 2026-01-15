export const RelationshipType = {
  PARTNER: "PARTNER",
  CHILD: "CHILD",
  PARENT: "PARENT",
  MEMBER: "MEMBER",
} as const;
// cái này dành cho select option
export const RelationshipTypeOptions = [
  { value: RelationshipType.PARTNER, label: "Vợ/Chồng" },
  { value: RelationshipType.CHILD, label: "Con" },
  { value: RelationshipType.PARENT, label: "Bố/Mẹ" },
  { value: RelationshipType.MEMBER, label: "Thành viên khác" },
];
