SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCrwHeadDataByBudgetID] 
(
@BudgetID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select a.CategoryNumber,a.CategoryDescription,a.CategoryTotal ,POID,isnull(sum(d.Amount),0) as POAmount ,isnull(sum(e.Amount),0) as InvoiceAmount
 from BudgetCategory as a
inner join COA as c on a.S1=c.SS1 and a.S2=c.SS2 and a.S3=c.SS3 -- and a.S4=c.SS4  and a.S5=c.SS5 and a.S6=c.SS6 and a.S7=c.SS7 and a.S8=c.SS8
inner join PurchaseOrderLine as d on d.COAID=c.COAID and d.POLineStatus!='Paid'
left join InvoiceLine as e on e.COAID=c.COAID and e.InvoiceLineStatus='Paid'
where a.BudgetID=@BudgetID  and a.CategoryNumber!=''
group by a.CategoryNumber,a.CategoryDescription ,a.CategoryTotal ,POID

union all

select CategoryNumber , CategoryDescription,CategoryTotal, 0 as POID ,0 as  POAmount,0 as  InvoiceAmount from BudgetCategory where BudgetID=2 and CategoryNumber not in (
select a.CategoryNumber
 from BudgetCategory as a
inner join COA as c on a.S1=c.SS1 and a.S2=c.SS2 and a.S3=c.SS3 -- and a.S4=c.SS4  and a.S5=c.SS5 and a.S6=c.SS6 and a.S7=c.SS7 and a.S8=c.SS8
inner join PurchaseOrderLine as d on d.COAID=c.COAID and d.POLineStatus!='Paid'
left join InvoiceLine as e on e.COAID=c.COAID and e.InvoiceLineStatus='Paid'
where a.BudgetID=@BudgetID  and a.CategoryNumber!=''
group by a.CategoryNumber

) order by categorynumber


END



GO