SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetFreeFieldDetail]
(
@CompanyCode varchar(50),
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CID int;

	select @CID=CompanyID from Company where CompanyCode=@CompanyCode and ProdID=@ProdID;

  
select isnull(a.FreeField1,'') as FreeField1 ,isnull(a.FreeField2,'') as FreeField2 , isnull(a.FreeField3,'') as FreeField3
 from PayrollFreeField
as a inner join TransactionCode as b on a.FreeField1=b.TransactionCodeID
 inner join TransactionCode as c on a.FreeField1=c.TransactionCodeID
 inner join TransactionCode as d on a.FreeField1=d.TransactionCodeID
 where a.CompanyId=@CID and a.ProdID=@ProdID and b.ProdID=@ProdID and c.ProdID=@ProdID
  and d.ProdID=@ProdID and b.Status='1'  and c.Status='1' and d.Status='1'

END



GO