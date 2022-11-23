SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertUpdateCompanyTaxInfo] --exec InsertUpdateCompanyTaxInfo '50','','','','','','','1'
(
@CompanyID int,
@federaltaxagency nvarchar(50),
@federaltaxform nvarchar(200),
@EIN nvarchar(20),
@CompanyTCC nvarchar(20),
@StateID nvarchar(20),
@StatetaxID nvarchar(20),
@CreatedBy int,
@ProdID int

)
AS
BEGIN
 -- SET NOCOUNT ON added to prevent extra result sets from
 -- interfering with SELECT statements.
 SET NOCOUNT ON;

 if exists( select * from taxinfo where CompanyID=@CompanyID)

  begin
   update dbo.taxinfo set federaltaxagency=@federaltaxagency,federaltaxform=@federaltaxform,EIN=@EIN,
  CompanyTCC=@CompanyTCC,StateID=@StateID,StatetaxID=@StatetaxID,ModifiedBy=@CreatedBy,ModifiedDate=CURRENT_TIMESTAMP
  where CompanyID=@CompanyID

  select taxinfoID from taxinfo where CompanyID=@CompanyID;
 
  end
  else
  begin
   insert into dbo.taxinfo (CompanyID,federaltaxagency,federaltaxform,EIN,CompanyTCC,StateID,StatetaxID,CreatedBy,CreatedDate,ProdID) values
(@CompanyID,@federaltaxagency,@federaltaxform,@EIN,@CompanyTCC,@StateID,@StatetaxID,@CreatedBy,CURRENT_TIMESTAMP ,@ProdID)
 
 SELECT cast(SCOPE_IDENTITY() as int)
 
  end

END



GO