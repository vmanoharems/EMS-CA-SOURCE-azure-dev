SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[SaveUpdatePurchaseOrderLine]
(
@POLineId int,
@POID int,
@COAID int,
@Amount decimal(18,2),

@ManualAdjustment decimal(18,2),
@ClearedAmount decimal(18,2),
@AdjustMentTotal decimal(18,2),
@RelievedTotal decimal(18,2),
@AvailToRelieve decimal(18,2),
@DisplayAmount decimal(18,2),

@LineDescription varchar(100),
@POLinestatus varchar(50),
@COAString varchar(200),
@Transactionstring varchar(200),
@CreatedBy int,
@ProdID int,
@ThirdPartyVendor varchar(100)
,@SetID int
,@SeriesID int
,@TaxCode nvarchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	if(@POLineId=0)
	begin
		insert into PurchaseOrderLine (POID,COAID,Amount,ManualAdjustment,ClearedAmount,AdjustMentTotal,RelievedTotal,AvailToRelieve,DisplayAmount
			,LineDescription,POLinestatus,COAString,Transactionstring,CreatedDate,CreatedBy,ProdID,ThirdPartyVendor,SetID,SeriesID,TaxCode)
		values(@POID,@COAID,@Amount,@ManualAdjustment,@ClearedAmount,@AdjustMentTotal,@RelievedTotal,@AvailToRelieve,@DisplayAmount
			,@LineDescription,@POLinestatus,@COAString,@Transactionstring,CURRENT_TIMESTAMP,@CreatedBy,@ProdID,@ThirdPartyVendor,@SetID,@SeriesID,@TaxCode);

		-- Following code is not needed as we'll update the PO header at the end no matter what
		--update purchaseorder set 
		--AdjustmentTotal=(select sum(AdjustmentTotal) from PurchaseOrderLine where POID=@POID),
		--RelievedTotal=(select sum(RelievedTotal) from PurchaseOrderLine where POID=@POID),
		--BalanceAmount=(select sum(DisplayAmount) from PurchaseOrderLine where POID=@POID)
		--where POID=@POID
	end
else
	begin
		--declare 
		--@PostedInvoice decimal(18,2),
		--@pendingInvoiceAmount decimal(18,2)

		--set @pendingInvoiceAmount=(select isnull(sum(amount),0.00)as amount  from invoiceline where polineid=@POLineId and InvoiceLinestatus='Pending')
		--set @PostedInvoice=(select isnull(sum(amount),0.00)as amount  from invoiceline where polineid=@POLineId and InvoiceLinestatus='Posted')

		update PurchaseOrderLine  set
			COAID=@COAID,
			ManualAdjustment=(ManualAdjustment+@ManualAdjustment),
--			AdjustMentTotal=ManualAdjustment+@ManualAdjustment-ClearedAmount,
--			RelievedTotal=@PostedInvoice,
			AvailToRelieve = case when @ManualAdjustment <> 0 then AvailtoRelieve + @ManualAdjustment else AvailtoRelieve end -- @DisplayAmount-@pendingInvoiceAmount,	
			,DisplayAmount=@DisplayAmount,
			LineDescription=@LineDescription,
			COAString=@COAString,Transactionstring=@Transactionstring,ModifiedDate=GETDATE(),ModifiedBy=@CreatedBy,
			SetID=@SetID,SeriesID=@SeriesID,TaxCode=@TaxCode
		where POlineID=@POLineId
		and ProdID = @ProdID
--		and POLineStatus = 'Open'

		IF @@ROWCOUNT = 0
		BEGIN
			-- NOTIFY THAT NOTHING WAS UPDATED
			SELECT 0;
			RETURN 0;
		END
		--update purchaseorder set 
		--	AdjustmentTotal=(select sum(AdjustmentTotal) from PurchaseOrderLine where POID=@POID),
		--	RelievedTotal=(select sum(RelievedTotal) from PurchaseOrderLine where POID=@POID),
		--	BalanceAmount=(select sum(DisplayAmount) from PurchaseOrderLine where POID=@POID)
		--where POID=@POID

		--declare @Balance int
		--set @Balance=(select BalanceAmount from PurchaseOrder where POID=@POID)
		--if (@Balance=0)
		--begin
		--	update PurchaseOrder set Status='Closed' where POID=@POID
		--end 

	end

	exec APIAPPO_UpdatePOHeaderfromLines @POID, @ProdID, default

select 1;
   
END
GO