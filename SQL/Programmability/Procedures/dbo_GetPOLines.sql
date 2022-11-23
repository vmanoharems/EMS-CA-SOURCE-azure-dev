CREATE PROCEDURE [dbo].[GetPOLines]     ---exec GetPOLines 8,67
(
@POID int,
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	 select POlineID,P.POID,P.COAID,Amount,LineDescription
	 , case when PO.Status = 'CLOSED' then PO.Status else P.POLinestatus end as POLinestatus
	 ,COA.COACode as COAString,
	 Transactionstring,CONVERT(varchar(10),p.CreatedDate,101) as CreatedDate,dbo.convertcodes(TransactionString) as TransStr 
	 ,ThirdPartyVendor,

	 isnull(SetID,'')as SetID ,
	isnull( t.AccountCode,'') as SetCode,
	isnull(SeriesID,'')as SeriesID ,
	isnull(  TT.AccountCode,'') as SeriesCode,
	isnull(p.TaxCode,'') as TaxCode,
	isnull(DisplayAmount,0.00)as NewAmount
	--isnull(AdjustMentTotal,0.00)as NewAmount
	--CASE WHEN PO.STATUS = 'CLOSED' then -(p.DisplayAmount) else DisplayAmount end as NewAmount
	,ISNULL(P.RelievedTotal,0.00) as RelievedTotal
	,dbo.CheckPOLineInInvoice(POlineID) as POCloseStatus
	 from PurchaseOrderLine p
	 JOIN PurchaseOrder PO on P.POID = PO.POID
	 join COA on P.COAID = COA.COAID
	 left outer join TblAccounts T on  t.AccountId=p.SetID
	left outer join TblAccounts  TT on TT.AccountId=p.SeriesID

	 where P.POID=@POID
	 and p.ProdID=@ProdID order by 1
	 

END




GO